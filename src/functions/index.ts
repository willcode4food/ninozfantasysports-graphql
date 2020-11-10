const { ApolloServer, gql } = require('apollo-server-cloud-functions')
const functions = require('firebase-functions')

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type Query {
        hello: String
    }
`

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
})

exports.api = functions.https.onRequest(server.createHandler())
