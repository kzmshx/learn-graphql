const { authorizeWithGitHub } = require('../../lib');
const { usePubSub } = require('../../lib');

const pubsub = usePubSub();

module.exports = {
  addFakeUsers: async (root, { count }, { db }) => {
    const { results } = await fetch(`https://randomuser.me/api/?results=${count}`).then(res => res.json());
    const users = results.map(r => ({
      githubToken: r.login.sha1,
      githubUser: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avatar: r.picture.thumbnail,
    }));

    await db.collection('users').insertMany(users);

    for (const newUser of users) {
      await pubsub.publish('user-added', { newUser });
    }

    return users;
  },
  fakeUserAuth: async (parent, { githubUser }, { db }) => {
    const user = await db.collection('users').findOne({ githubUser });
    if (!user) {
      throw new Error(`Cannot find user with githubUser "${githubUser}"`);
    }

    return {
      token: user.githubToken,
      user,
    };
  },
  githubAuth: async (parent, { code }, { db }) => {
    const authResult = await authorizeWithGitHub({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    });
    if (authResult.message) {
      throw new Error(authResult.message);
    }

    const { name, login, avatar_url, access_token } = authResult;

    await db.collection('users').replaceOne(
      {
        githubUser: login,
      },
      {
        name,
        githubUser: login,
        githubToken: access_token,
        avatar: avatar_url,
      },
      { upsert: true }
    );

    const user = await db.collection('users').findOne({ githubUser: login }, { _id: 0 });

    await pubsub.publish('user-added', { newUser: user });

    return { user, token: access_token };
  },
  postPhoto: async (parent, args, { db, currentUser }) => {
    if (!currentUser) {
      throw new Error('only an authorized user can post a photo');
    }

    const newPhoto = {
      ...args.input,
      githubUser: currentUser.githubUser,
      createdAt: new Date(),
    };

    const { insertedId } = db.collection('photos').insertOne(newPhoto);
    newPhoto.id = insertedId;

    await pubsub.publish('photo-added', { newPhoto });

    return newPhoto;
  },
};
