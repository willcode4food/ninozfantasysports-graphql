import { IsNotEmpty } from 'class-validator'
import { Field, InputType, ID } from 'type-graphql'
import { LeagueRegistration } from '../LeagueRegistrationEntity'

@InputType()
export default class LeagueRegistrationUpdateInput implements Partial<LeagueRegistration> {
    @Field(() => ID)
    id: string

    @Field()
    @IsNotEmpty()
    isActive: boolean
}
