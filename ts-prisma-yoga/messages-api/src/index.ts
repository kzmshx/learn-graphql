import { createServer } from 'node:http'
import { createYoga } from '@graphql-yoga/node'

const port = Number(process.env.PORT) || 4000

const yoga = createYoga({})
const server = createServer(yoga)

server.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}/graphql`)
})
