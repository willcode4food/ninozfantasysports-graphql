import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import { League, LeagueRepository } from '../entites/League'
import { Season, SeasonRepository } from '../entites/Season'
import { LeagueInput } from './types'

@Resolver((_of) => League)
export class LeagueResolver {
    @Query((_returns) => League, { nullable: false })
    async returnSingleLeague(@Arg('id') id: string): Promise<League> {
        const league = await LeagueRepository.findById(id)
        const seasons = await SeasonRepository.whereEqualTo('leagueId', league.id).find()
        return { ...league, seasons }
    }

    @Query(() => [League])
    async returnAllLeagues(): Promise<League[]> {
        return LeagueRepository.find()
    }

    @Mutation(() => League)
    async createLeague(@Arg('data', { validate: true }) { name, ownerId, type }: LeagueInput): Promise<League> {
        let league: League = {
            id: '',
            name: '',
            ownerId: '',
            type: '',
            dateCreated: new Date(),
            dateUpdated: new Date(),
            seasons: [],
        }

        try {
            const entity = new League()
            entity.name = name
            entity.ownerId = ownerId
            entity.type = type
            entity.dateCreated = new Date()
            entity.dateUpdated = new Date()
            league = await LeagueRepository.create(entity)
        } catch (e) {
            console.log(e.message)
            return league
        }

        return league
    }
    @Mutation(() => League)
    async updateLeague(@Arg('data', { validate: true }) { id, name, ownerId, type }: LeagueInput): Promise<League> {
        let league: League = {
            id: '',
            name: '',
            ownerId: '',
            type: '',
            dateCreated: new Date(),
            dateUpdated: new Date(),
            seasons: [],
        }
        try {
            const leagueToUpdate = await LeagueRepository.findById(id)
            leagueToUpdate.name = name || leagueToUpdate.name
            leagueToUpdate.ownerId = ownerId || leagueToUpdate.ownerId
            leagueToUpdate.type = type || leagueToUpdate.type
            leagueToUpdate.dateUpdated = new Date()
            league = await LeagueRepository.update(leagueToUpdate)
        } catch (e) {
            console.log(e.message)
            return league
        }
        return league
    }
    @Mutation(() => Boolean)
    async removeSingleLeague(@Arg('id') id: string): Promise<boolean> {
        try {
            await LeagueRepository.delete(id)
        } catch (e) {
            console.log(e.message)
            return false
        }
        return true
    }
}
