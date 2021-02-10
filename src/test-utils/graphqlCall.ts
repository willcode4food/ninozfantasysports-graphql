import { graphql } from 'graphql'
import { buildSchemaSync } from 'type-graphql'
import { Maybe } from 'graphql/jsutils/Maybe'
import { UserResolver } from '../functions/features/Users/UserResolver'
import { LeagueResolver } from '../functions/features/Leagues/LeagueResolver'
import { LeagueRegistrationResolver } from '../functions/features/LeagueRegistration/LeagueRegistrationResolver'
import { SeasonResolver } from '../functions/features/Seasons/SeasonResolver'
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
        resolvers: [UserResolver, LeagueResolver, SeasonResolver, LeagueRegistrationResolver],
        emitSchemaFile: `${schemaPath}/schema.gql`,
        validate: false,
    })
    return await graphql({
        schema,
        source,
        variableValues,
    })
}
