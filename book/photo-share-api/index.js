const { readFileSync } = require('fs');
const { createServer } = require('http');
const path = require('path');

const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { ApolloServer } = require('apollo-server-express');
const dotenv = require('dotenv');
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const { useServer } = require('graphql-ws/lib/use/ws');
const { MongoClient } = require('mongodb');
const { WebSocketServer } = require('ws');

const resolvers = require('./resolvers');
const typeDefs = readFileSync(path.join(__dirname, 'typeDefs.graphql'), { encoding: 'utf-8' });

dotenv.config();

const findUserByGitHubToken = async (db, githubToken) => {
  return await db.collection('users').findOne({ githubToken });
};

(async () => {
  const client = await MongoClient.connect(process.env.MONGODB_HOST);
  const db = client.db();

  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const currentUser = await findUserByGitHubToken(db, req.headers.authorization);
      return { db, currentUser };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: server.graphqlPath,
  });
  const serverCleanup = useServer(
    {
      schema,
      context: async ctx => {
        const currentUser = await findUserByGitHubToken(db, ctx.connectionParams.Authorization);
        return { db, currentUser };
      },
    },
    wsServer
  );

  await server.start();
  server.applyMiddleware({ app });

  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'));
  app.get('/playground', expressPlayground({ endpoint: server.graphqlPath }));

  const PORT = 4000;
  httpServer.listen(PORT, () => console.log(`Server is now running on http://localhost:${PORT}${server.graphqlPath}`));
})();
