import { ApolloServer } from 'apollo-server-cloud-functions'
import * as functions from 'firebase-functions'
import { buildSchemaSync } from 'type-graphql'
import { initialize } from './connection'
require('dotenv')

initialize()

import { UserResolver } from './resolvers/UserResolver'
import { LeagueResolver } from './resolvers/LeagueResolver'
import { SeasonResolver } from './resolvers/SeasonResolver'

const schemaPath = process.env.NODE_ENV === 'development' ? './tmp' : '/tmp'
const schema = buildSchemaSync({
    resolvers: [UserResolver, LeagueResolver, SeasonResolver],
    emitSchemaFile: `${schemaPath}/schema.gql`,
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
