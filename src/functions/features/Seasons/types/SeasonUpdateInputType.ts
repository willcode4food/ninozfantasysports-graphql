import { InputType, Field, ID } from 'type-graphql'
import { IsDate, Length, IsNotEmpty } from 'class-validator'
import { Season } from '../SeasonEntity'

@InputType()
export default class SeasonUpdateInputType implements Partial<Season> {
    @Field(() => ID)
    id: string

    @Field(() => ID)
    leagueId: string

    @Field()
    @Length(2, 255)
    @IsNotEmpty()
    name: string

    @Field()
    @IsDate()
    @IsNotEmpty()
    startDate: Date

    @Field()
    @IsDate()
    @IsNotEmpty()
    endDate: Date
}
