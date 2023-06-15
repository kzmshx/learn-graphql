const { readFileSync } = require('fs');
const path = require('path');

const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;

const resolvers = require('./resolvers');

const typeDefs = readFileSync(path.join(__dirname, 'graphql/schema.graphql'), { encoding: 'utf-8' });

(async () => {
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'));
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

  app.listen({ port: 4000 }, () => console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`));
})();
