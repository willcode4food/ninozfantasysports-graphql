import { graphql } from 'graphql'
import { buildSchemaSync } from 'type-graphql'
import { Maybe } from 'graphql/jsutils/Maybe'
import { UserResolver } from '../functions/resolvers/UserResolver'
import { LeagueResolver } from '../functions/resolvers/LeagueResolver'
import { SeasonResolver } from '../functions/resolvers/SeasonResolver'
require('dotenv')

interface Options {
    source: string
    variableValues?: Maybe<{
        [key: string]: any
    }>
}

export async function graphqlCall({ source, variableValues }: Options) {
    const schemaPath = process.env.NODE_ENV === 'development' ? './tmp' : '/tmp'
    const schema = buildSchemaSync({
        resolvers: [UserResolver, LeagueResolver, SeasonResolver],
        emitSchemaFile: `${schemaPath}/schema.gql`,
        validate: false,
    })
    return await graphql({
        schema,
        source,
        variableValues,
    })
}