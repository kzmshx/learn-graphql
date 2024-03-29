import { createServer } from 'node:http'
import { createYoga } from '@graphql-yoga/node'
import { schema } from './schema'
import dotenv from 'dotenv'

dotenv.config()

const port = Number(process.env.API_PORT) || 4000

const yoga = createYoga({ schema })
const server = createServer(yoga)

server.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}/graphql`)
})
