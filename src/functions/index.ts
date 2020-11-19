import { ApolloServer } from 'apollo-server-cloud-functions'
import * as functions from 'firebase-functions'
import { buildSchemaSync } from 'type-graphql'
import { initialize } from './connection'
import path from 'path'

initialize()

import { UserResolver } from './resolvers/users'

const schema = buildSchemaSync({
    resolvers: [UserResolver],
    emitSchemaFile: path.resolve('/tmp', 'schema.gql'),
    validate: false,
})
const server = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
})
exports.api = functions.https.onRequest(
    server.createHandler({
        cors: {
            origin: '*',
            credentials: false,
        },
    })
)
