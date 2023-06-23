const { usePubSub } = require('../../lib');

const pubsub = usePubSub();

module.exports = {
  newUser: {
    subscribe: () => pubsub.asyncIterator(['user-added']),
  },
  newPhoto: {
    subscribe: () => pubsub.asyncIterator(['photo-added']),
  },
};
