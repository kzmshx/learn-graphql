const tags = require('../../data/tags.json');
const users = require('../../data/users.json');

module.exports = {
  id: parent => {
    return parent.id || parent._id;
  },
  url: parent => {
    return `/img/${parent._id}.jpg`;
  },
  postedBy: ({ githubUser }, args, { db }) => {
    return db.collection('users').findOne({ githubUser });
  },
  taggedUsers: parent => {
    return tags
      .filter(t => t.photoID === parent.id)
      .map(t => t.userID)
      .map(userID => users.find(u => u.githubUser === userID));
  },
};
