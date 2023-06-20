const { readFileSync } = require('fs');
const { createServer } = require('http');
const path = require('path');

const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServer } = require('apollo-server-express');
const dotenv = require('dotenv');
const express = require('express');
const { execute, subscribe } = require('graphql');
const expressPlayground = require('graphql-playground-middleware-express').default;
const { MongoClient } = require('mongodb');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const resolvers = require('./resolvers');

const typeDefs = readFileSync(path.join(__dirname, 'graphql/schema.graphql'), { encoding: 'utf-8' });

dotenv.config();

(async () => {
  const client = await MongoClient.connect(process.env.MONGODB_HOST, { useNewUrlParser: true });
  const db = client.db();

  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // eslint-disable-next-line prefer-const
  let subscriptionServer;

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const githubToken = req.headers.authorization;
      const currentUser = await db.collection('users').findOne({ githubToken });
      return { db, currentUser };
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: async ({ req }) => {
        const githubToken = req.headers.authorization;
        const currentUser = await db.collection('users').findOne({ githubToken });
        return { db, currentUser };
      },
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );

  await server.start();
  server.applyMiddleware({ app });

  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'));
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

  const PORT = 4000;
  httpServer.listen(PORT, () => console.log(`Server is now running on http://localhost:${PORT}${server.graphqlPath}`));
})();
