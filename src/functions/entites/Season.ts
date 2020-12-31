import { getRepository, Collection } from 'fireorm'
import { ObjectType, Field, ID } from 'type-graphql'

export const returnId = () => ID

@Collection('seasons')
@ObjectType({ description: 'The Season model' })
export class Season {
    @Field(returnId)
    id: string

    @Field(returnId)
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
