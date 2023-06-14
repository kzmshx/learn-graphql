const fs = require('fs')
const path = require('path')
const { ApolloServer } = require('apollo-server')

const typeDefs = fs.readFileSync(path.join(__dirname, 'graphql/schema.graphql'), { encoding: 'utf-8' })

const users = require('./data/users.json')
const photos = require('./data/photos.json')
const tags = require('./data/tags.json')
const { GraphQLScalarType } = require('graphql/type')
let _id = photos.length

const resolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value',
    parseLiteral: ast => ast.value,
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
  }),
  User: {
    postedPhotos: parent => photos.filter(p => p.githubUser === parent.githubUser),
    inPhotos: parent =>
      tags
        .filter(t => t.userID === parent.githubUser)
        .map(t => t.photoID)
        .map(photoID => photos.find(p => p.id === photoID)),
  },
  Photo: {
    url: parent => `https://www.example.com/img/${parent.id}.jpg`,
    postedBy: parent => users.find(u => u.githubUser === parent.githubUser),
    taggedUsers: parent =>
      tags
        .filter(t => t.photoID === parent.id)
        .map(t => t.userID)
        .map(userID => users.find(u => u.githubUser === userID)),
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
        createdAt: new Date(),
      }
      photos.push(newPhoto)
      return newPhoto
    },
  },
}

new ApolloServer({ typeDefs, resolvers }).listen().then(({ url }) => console.log(`GraphQL Server running on ${url}`))
