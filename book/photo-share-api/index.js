const fs = require('fs')
const path = require('path')
const { ApolloServer } = require('apollo-server')

const typeDefs = fs.readFileSync(path.join(__dirname, 'graphql/schema.graphql'), { encoding: 'utf-8' })

const users = require('./data/users.json')
const photos = require('./data/photos.json')
let _id = photos.length

const resolvers = {
  Photo: {
    url: (parent) => `https://www.example.com/img/${parent.id}.jpg`,
    postedBy: (parent) => users.find((u) => u.githubUser === parent.githubUser),
  },
  User: {
    postedPhotos: (parent) => photos.filter((p) => p.githubUser === parent.githubUser),
  },
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },
  Mutation: {
    postPhoto(parent, args) {
      const newPhoto = {
        id: _id++,
        ...args.input,
      }
      photos.push(newPhoto)
      return newPhoto
    },
  },
}

new ApolloServer({ typeDefs, resolvers }).listen().then(({ url }) => console.log(`GraphQL Server running on ${url}`))
