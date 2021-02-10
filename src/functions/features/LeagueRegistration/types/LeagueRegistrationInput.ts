import { IsNotEmpty } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import IsUserIdExists from '../decorators/isUserIdExists'
import IsLeagueIdExists from '../decorators/isLeagueIdExists'
import { LeagueRegistration } from '../LeagueRegistrationEntity'

@InputType()
export default class LeagueRegistrationInput implements Partial<LeagueRegistration> {
    @Field()
    @IsNotEmpty()
    @IsUserIdExists({ message: 'Invalid userId' })
    userId: string

    @Field()
    @IsNotEmpty()
    @IsLeagueIdExists({ message: 'Invalid leagueId' })
    leagueId: string

    @Field()
    seasonId: string
}
