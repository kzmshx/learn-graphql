import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import resolvers from './resolvers.js'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import { createRequire } from 'node:module'
import { expressMiddleware } from '@apollo/server/express4'
import { fileURLToPath } from 'url'
import { join } from 'path'
import { loadSchemaSync } from '@graphql-tools/load'

const { json } = bodyParser

const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..')

const expressPlayground = require('graphql-playground-middleware-express').default

const schema = loadSchemaSync(join(__dirname, './graphql/schema.graphql'), { loaders: [new GraphQLFileLoader()] })
const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

const app = express()
const httpServer = http.createServer(app)
const server = new ApolloServer({
  schema: schemaWithResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await server.start()

app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'))
app.use(
  '/graphql',
  cors(),
  json(),
  expressMiddleware(server, { context: async ({ req }) => ({ token: req.header.token }) })
)
app.use('/playground', expressPlayground({ endpoint: '/graphql' }))

await new Promise(resolve => httpServer.listen(4000, resolve))

console.log(`GraphQL Server running @ http://localhost:4000/graphql`)
