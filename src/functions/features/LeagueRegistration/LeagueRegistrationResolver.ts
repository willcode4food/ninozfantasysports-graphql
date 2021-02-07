import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { League } from '../Leagues/LeagueEntity'
import { LeagueRegistration, LeagueRegistrationRepository } from './LeagueRegistrationEntity'
import LeagueRegistrationInput from './types/LeagueRegistrationInput'

export const resolveLeagueRegistration = () => LeagueRegistration

@Resolver(resolveLeagueRegistration)
export class LeagueRegistrationResolver {
    @Query((_returns) => [LeagueRegistration])
    async returnLeagueRegistrationByUser(@Arg('userId') userId: string): Promise<LeagueRegistration[]> {
        return await LeagueRegistrationRepository.whereEqualTo('userId', userId).find()
    }

    @Query((_returns) => [LeagueRegistration])
    async returnLeagueRegistrationByLeague(@Arg('leagueId') leagueId: string): Promise<LeagueRegistration[]> {
        return await LeagueRegistrationRepository.whereEqualTo('leagueId', leagueId).find()
    }

    @Query((_returns) => [LeagueRegistration])
    async returnLeagueRegistrationBySeason(@Arg('seasonId') seasonId: string): Promise<LeagueRegistration[]> {
        return await LeagueRegistrationRepository.whereEqualTo('seasonId', seasonId).find()
    }

    @Mutation(() => LeagueRegistration)
    async createLeagueRegistration(
        @Arg('data', { validate: true }) { userId, leagueId, seasonId }: LeagueRegistrationInput
    ): Promise<LeagueRegistration> {
        let leagueRegistration: LeagueRegistration = {
            id: '',
            userId: '',
            seasonId: '',
            leagueId: '',
            isActive: true,
            dateRegistered: new Date(),
        }

        try {
            const entity = new LeagueRegistration()
            entity.userId = userId
            entity.seasonId = seasonId
            entity.leagueId = leagueId
            entity.isActive = true
            entity.dateRegistered = new Date()
            leagueRegistration = await LeagueRegistrationRepository.create(entity)
            return leagueRegistration
        } catch (e) {
            throw new Error(e.message)
        }
    }
}
