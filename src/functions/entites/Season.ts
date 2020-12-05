import { getRepository, Collection } from 'fireorm'
import { ObjectType, Field, ID } from 'type-graphql'

@Collection('seasons')
@ObjectType({ description: 'The Season model' })
export class Season {
    @Field(() => ID)
    id: string

    @Field(() => ID)
    leagueId: string

    @Field()
    dateCreated: Date

    @Field()
    dateUpdated: Date

    @Field()
    name: string

    @Field()
    startDate: Date

    @Field()
    endDate: Date
}

export const SeasonRepository = getRepository(Season)
