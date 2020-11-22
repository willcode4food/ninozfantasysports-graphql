import { getRepository, Collection } from 'fireorm'
import { ObjectType, Field, ID } from 'type-graphql'

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

    constructor() {
        this.id = ''
        this.dateCreated = new Date()
        this.dateUpdated = new Date()
        this.name = ''
        this.ownerId = ''
        this.type = ''
    }
}

export const LeagueRepository = getRepository(League)
