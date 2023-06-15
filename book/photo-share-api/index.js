const { readFileSync } = require('fs');
const path = require('path');

const { ApolloServer } = require('apollo-server-express');
const dotenv = require('dotenv');
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const { MongoClient } = require('mongodb');

const resolvers = require('./resolvers');

dotenv.config();

const typeDefs = readFileSync(path.join(__dirname, 'graphql/schema.graphql'), { encoding: 'utf-8' });

(async () => {
  const app = express();
  const MONGODB_HOST = process.env.MONGODB_HOST;

  const client = await MongoClient.connect(MONGODB_HOST, { useNewUrlParser: true });
  const db = client.db();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const githubToken = req.headers.authorization;
      const currentUser = await db.collection('users').findOne({ githubToken });
      return { db, currentUser };
    },
  });
  await server.start();

  server.applyMiddleware({ app });

  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'));
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

  app.listen({ port: 4000 }, () => {
    console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`);
  });
})();
