import { getRepository, Collection } from 'fireorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { Season } from './Season'

@Collection('leagues')
@ObjectType({ description: 'The Leagues model' })
export class League {
    @Field(() => ID)
    id: string

    @Field()
    dateCreated: Date

    @Field()
    dateUpdated: Date

    @Field()
    name: string

    @Field()
    ownerId: string

    @Field()
    type: string

    @Field(() => [Season])
    seasons: Season[]
}

export const LeagueRepository = getRepository(League)
