import { InputType, Field } from 'type-graphql'
import { Length, IsNotEmpty, IsDate, IsIn } from 'class-validator'
import { League } from '../../entites/Leagues'

@InputType()
export class LeagueInput implements Partial<League> {
    @Field()
    id: string
    @Field()
    @IsDate()
    dateCreated: Date
    @Field()
    @IsDate()
    dateUpdated: Date
    @Field()
    @Length(2, 255)
    name: string
    @Field()
    @IsNotEmpty()
    ownerId: string
    @Field()
    @IsNotEmpty()
    @IsIn(['golf', 'football', 'baseball', 'basketball', 'hockey', 'dota2', 'lol', 'overwatch'])
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
