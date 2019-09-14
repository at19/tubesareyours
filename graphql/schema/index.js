const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Video {
  _id: ID!
  url: String!
  date: String!
  creator: User!
}

type User {
  _id: ID!
  name: String!
  email: String!
  password: String
  createdVideos: [Video!]!
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

input VideoInput {
  url: String!
}

input UserInput {
  name: String!
  email: String!
  password: String!
}
type RootQuery {
    videos(first: Int, offset: Int): [Video!]!
    users(first: Int, offset: Int): [User!]!
    login(email: String!, password: String!): AuthData!
}
type RootMutation {
    createVideo(videoInput: VideoInput): Video
    createUser(userInput: UserInput): User
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
