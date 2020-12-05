import { InputType, Field, ID } from 'type-graphql'
import { IsDate, Length } from 'class-validator'
import { Season } from '../../entites/Season'

@InputType()
export class SeasonInput implements Partial<Season> {
    @Field(() => ID)
    id: string

    @Field(() => ID)
    leagueId: string

    @Field({ nullable: false })
    @Length(2, 255)
    name: string

    @Field({ nullable: false })
    @IsDate()
    startDate: Date

    @Field({ nullable: false })
    @IsDate()
    endDate: Date
}
