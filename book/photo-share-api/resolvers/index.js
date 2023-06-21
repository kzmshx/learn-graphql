const Mutation = require('./Mutation');
const Query = require('./Query');
const Subscription = require('./Subscription');
const types = require('./types');

module.exports = {
  Query,
  Mutation,
  Subscription,
  ...types,
};
