import { InputType, Field, ID } from 'type-graphql'
import { Length, IsNotEmpty, IsIn } from 'class-validator'
import { League } from './LeagueEntity'

@InputType()
export default class LeagueUpdateInputType implements Partial<League> {
    @Field(() => ID)
    id: string

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
