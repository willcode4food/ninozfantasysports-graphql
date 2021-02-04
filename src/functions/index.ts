import * as express from 'express'
import { ApolloServer } from 'apollo-server-express'
import * as cors from 'cors'
import * as functions from 'firebase-functions'
import { buildSchemaSync } from 'type-graphql'
import { initialize } from './connection'
import { authMiddleware, MiddleWareFn } from './middleware/authMiddleware'

require('dotenv')

initialize()
import { UserResolver } from './features/Users/UserResolver'
import { LeagueResolver } from './resolvers/LeagueResolver'
import { SeasonResolver } from './resolvers/SeasonResolver'

const app = express()

app.use(cors({ origin: true }))
app.use(<MiddleWareFn>authMiddleware)

const schemaPath = process.env.NODE_ENV === 'development' ? './tmp' : '/tmp'
const schema = buildSchemaSync({
    resolvers: [UserResolver, LeagueResolver, SeasonResolver],
    emitSchemaFile: `${schemaPath}/schema.gql`,
    validate: false,
})
const server = new ApolloServer({
    schema,
    playground: process.env.NODE_ENV === 'development',
    introspection: process.env.NODE_ENV === 'development',
})
server.applyMiddleware({ app, path: '/' })

export const api = functions.https.onRequest(function (request: express.Request, response: express.Response): void {
    return app(request, response)
})
