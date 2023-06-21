const { GraphQLScalarType } = require('graphql/type');

module.exports = new GraphQLScalarType({
  name: 'DateTime',
  description: 'A valid date time value',
  parseLiteral: ast => ast.value,
  parseValue: value => new Date(value),
  serialize: value => new Date(value).toISOString(),
});
