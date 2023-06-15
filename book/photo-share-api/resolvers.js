const { GraphQLScalarType } = require('graphql/type');

const photos = require('./data/photos.json');
const tags = require('./data/tags.json');
const users = require('./data/users.json');
const { authorizeWithGitHub } = require('./lib');
let _id = photos.length;

module.exports = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value',
    parseLiteral: ast => ast.value,
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
  }),
  User: {
    postedPhotos: parent => photos.filter(p => p.githubUser === parent.githubUser),
    inPhotos: parent =>
      tags
        .filter(t => t.userID === parent.githubUser)
        .map(t => t.photoID)
        .map(photoID => photos.find(p => p.id === photoID)),
  },
  Photo: {
    url: parent => `https://www.example.com/img/${parent.id}.jpg`,
    postedBy: parent => users.find(u => u.githubUser === parent.githubUser),
    taggedUsers: parent =>
      tags
        .filter(t => t.photoID === parent.id)
        .map(t => t.userID)
        .map(userID => users.find(u => u.githubUser === userID)),
  },
  Query: {
    totalPhotos: (parent, args, { db }) => {
      return db.collection('photos').estimatedDocumentCount();
    },
    allPhotos: (parent, args, { db }) => {
      return db.collection('photos').find().toArray();
    },
    totalUsers: (parent, args, { db }) => {
      return db.collection('users').estimatedDocumentCount();
    },
    allUsers: (parent, args, { db }) => {
      return db.collection('users').find().toArray();
    },
  },
  Mutation: {
    async githubAuth(parent, { code }, { db }) {
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

      return { user, token: access_token };
    },
    postPhoto(parent, args) {
      const newPhoto = {
        id: _id++,
        ...args.input,
        createdAt: new Date(),
      };
      photos.push(newPhoto);
      return newPhoto;
    },
  },
};
