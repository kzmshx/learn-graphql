const fs = require('fs')
const path = require('path')
const { ApolloServer } = require('apollo-server')

const typeDefs = fs.readFileSync(path.join(__dirname, 'graphql/schema.graphql'), { encoding: 'utf-8' })

const users = [
  { githubUser: 'mHattrup', name: 'Mike Hattrup' },
  { githubUser: 'gPlake', name: 'Glen Plake' },
  { githubUser: 'sSchmidt', name: 'Scot Schmidt' },
]
const photos = [
  {
    id: '0',
    name: 'Sample photo 1',
    description: 'A sample photo',
    category: 'SELFIE',
    githubUser: 'mHattrup',
  },
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The heart chute is one of my favorite chutes',
    category: 'ACTION',
    githubUser: 'gPlake',
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'sSchmidt',
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'sSchmidt',
  },
]
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

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => console.log(`GraphQL Server running on ${url}`))
