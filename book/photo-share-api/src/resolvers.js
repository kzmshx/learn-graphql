import { GraphQLScalarType } from 'graphql'

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const photos = require('./data/photos.json')
const tags = require('./data/tags.json')
const users = require('./data/users.json')

let _id = photos.length

export default {
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
