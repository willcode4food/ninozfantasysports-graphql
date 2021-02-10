import { Collection, getRepository } from 'fireorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { Season } from '../Seasons/SeasonEntity'

export const returnId = () => ID
export const returnSeasons = () => [Season]

@Collection('leagues')
@ObjectType({ description: 'The Leagues model' })
export class League {
    // istanbul ignore next
    @Field(returnId)
    id: string

    @Field()
    dateCreated: Date

    @Field()
    dateUpdated: Date

    @Field()
    description: string

    @Field()
    name: string

    @Field()
    ownerId: string

    @Field()
    ownerName: string

    @Field()
    type: string

    @Field(returnSeasons)
    seasons: Season[]
}

export const LeagueRepository = getRepository(League)
