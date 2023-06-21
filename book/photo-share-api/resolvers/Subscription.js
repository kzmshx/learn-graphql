const { usePubSub } = require('../lib');

const pubsub = usePubSub();

module.exports = {
  newPhoto: {
    subscribe: () => pubsub.asyncIterator(['photo-added']),
  },
};
