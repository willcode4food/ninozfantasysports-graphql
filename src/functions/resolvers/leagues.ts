import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from 'type-graphql'
import { League, LeagueRepository } from '../entites/Leagues'
import { LeagueInput } from './types/league-input'

@Resolver((_of) => League)
export class LeagueResolver {
    @Query(() => [League])
    async returnSingleLeague(@Arg('id') id: string) {
        return await LeagueRepository.findById(id)
    }

    @Query(() => [League])
    async returnAllLeagues() {
        return await LeagueRepository.find()
    }

    @Mutation(() => League)
    async createLeague(@Arg('data') { name, ownerId, type }: LeagueInput): Promise<League> {
        const entity = new League()
        entity.name = name
        entity.ownerId = ownerId
        entity.type = type
        entity.dateCreated = new Date()
        entity.dateUpdated = new Date()
        const league = await LeagueRepository.create(entity)
        return league
    }
    @Mutation(() => League)
    async updateLeague(@Arg('data') { id, name, ownerId, type }: LeagueInput): Promise<League> {
        let league: League = {
            id: '',
            name: '',
            ownerId: '',
            type: '',
            dateCreated: new Date(),
            dateUpdated: new Date(),
        }
        try {
            const leagueToUpdate = await LeagueRepository.findById(id)
            leagueToUpdate.name = name || leagueToUpdate.name
            leagueToUpdate.ownerId = ownerId || leagueToUpdate.ownerId
            leagueToUpdate.type = type || leagueToUpdate.type
            leagueToUpdate.dateUpdated = new Date()
            league = await LeagueRepository.update(leagueToUpdate)
            return league
        } catch (e) {
            console.log(e.message)
        }
        return league
    }
    @Mutation(() => League)
    async removeSingleLeague(@Arg('data') { id }: LeagueInput): Promise<boolean> {
        try {
            await LeagueRepository.delete(id)
        } catch (e) {
            console.log(e.message)
            return false
        }
        return true
    }
}
