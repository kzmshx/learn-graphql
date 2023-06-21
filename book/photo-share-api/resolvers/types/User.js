const photos = require('../../data/photos.json');
const tags = require('../../data/tags.json');

module.exports = {
  postedPhotos: ({ githubUser }, args, { db }) => {
    return db.collection('photos').find({ githubUser }).toArray();
  },
  inPhotos: parent => {
    return tags
      .filter(t => t.userID === parent.githubUser)
      .map(t => t.photoID)
      .map(photoID => photos.find(p => p.id === photoID));
  },
};
