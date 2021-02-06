import { getRepository, Collection } from 'fireorm'
import { ObjectType, Field, ID } from 'type-graphql'

export const returnId = () => ID

@Collection('leagueRegistration')
@ObjectType({ description: 'The League Registraion' })
export class LeagueRegistration {
    @Field(returnId)
    id: string

    @Field()
    dateRegistered: Date

    @Field()
    userId: string

    @Field()
    leagueId: string

    @Field()
    seasonId: string

    @Field()
    isActive: boolean
}
