import { InputType, Field, ID } from 'type-graphql'
import { IsDate, Length, IsNotEmpty } from 'class-validator'
import { Season } from '../../entites/Season'

@InputType()
export class SeasonInput implements Partial<Season> {
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
