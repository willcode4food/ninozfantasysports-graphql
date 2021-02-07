import { IsIn, IsNotEmpty, Length } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { League } from '../LeagueEntity'

@InputType()
export default class LeagueInput implements Partial<League> {
    @Field()
    @Length(2, 255)
    @IsNotEmpty()
    name: string

    @Field()
    description: string

    @Field()
    @IsNotEmpty()
    ownerId: string

    @Field()
    @IsNotEmpty()
    @IsIn(['golf', 'football', 'baseball', 'basketball', 'hockey', 'dota2', 'lol', 'overwatch'])
    type: string
}
