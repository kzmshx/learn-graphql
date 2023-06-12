const fs = require('fs')
const path = require('path')
const { ApolloServer } = require('apollo-server')

const typeDefs = fs.readFileSync(path.join(__dirname, 'graphql/schema/schema.graphql'), { encoding: 'utf-8' })

let _id = 0
const photos = []

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },
  Mutation: {
    postPhoto(parent, args) {
      const newPhoto = {
        id: _id++,
        ...args,
      }
      photos.push(newPhoto)
      return newPhoto
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => console.log(`GraphQL Server running on ${url}`))
