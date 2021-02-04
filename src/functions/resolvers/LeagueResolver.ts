import { User, UserEntityRepository } from '../features/Users/UserEntity'
import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import { League, LeagueRepository } from '../entities/League'
import { Season, SeasonRepository } from '../entities/Season'
import { LeagueInput, LeagueUpdateInput } from './types'

export const resolveLeague = () => League

@Resolver(resolveLeague)
export class LeagueResolver {
    @Query((_returns) => League, { nullable: false })
    async returnSingleLeague(@Arg('id') id: string): Promise<League> {
        const league = await LeagueRepository.findById(id)
        const owner = await UserEntityRepository.findById(league.ownerId)
        const seasons = await SeasonRepository.whereEqualTo('leagueId', league.id).find()
        const ownerName = owner.username
        return { ...league, seasons, ownerName }
    }

    @Query(() => [League])
    async returnAllLeagues(): Promise<League[]> {
        const allLeagues = await LeagueRepository.find()
        const allSeasons = await SeasonRepository.orderByAscending('startDate').find()
        const allUsers = await UserEntityRepository.find()
        return allLeagues.map((league) => {
            const seasons = allSeasons.filter((season) => league.id === season.leagueId)
            const ownerRecord = allUsers.filter((user) => user.id === league.ownerId)[0]
            const ownerName = ownerRecord.username
            return { ...league, seasons, ownerName }
        })
    }

    @Mutation(() => League)
    async createLeague(
        @Arg('data', { validate: true }) { description, name, ownerId, type }: LeagueInput
    ): Promise<League> {
        let league: League = {
            id: '',
            name: '',
            ownerId: '',
            ownerName: '',
            type: '',
            description: '',
            dateCreated: new Date(),
            dateUpdated: new Date(),
            seasons: [],
        }

        try {
            const entity = new League()
            entity.name = name
            entity.ownerId = ownerId
            entity.type = type
            entity.description = description
            entity.dateCreated = new Date()
            entity.dateUpdated = new Date()
            league = await LeagueRepository.create(entity)
            return league
        } catch (e) {
            throw new Error(e.message)
        }
    }
    @Mutation(() => League)
    async updateLeague(
        @Arg('data', { validate: true }) { id, description, name, ownerId, type }: LeagueUpdateInput
    ): Promise<League> {
        let league: League = {
            id: '',
            name: '',
            ownerId: '',
            ownerName: '',
            type: '',
            description: '',
            dateCreated: new Date(),
            dateUpdated: new Date(),
            seasons: [],
        }
        try {
            const leagueToUpdate = await LeagueRepository.findById(id)
            if (!leagueToUpdate) {
                throw new Error('LeagueId is invalid')
            }
            leagueToUpdate.name = name
            leagueToUpdate.description = description
            leagueToUpdate.ownerId = ownerId
            leagueToUpdate.type = type
            leagueToUpdate.dateUpdated = new Date()
            league = await LeagueRepository.update(leagueToUpdate)
            return league
        } catch (e) {
            throw new Error(e.message)
        }
    }
    @Mutation(() => Boolean)
    async removeSingleLeague(@Arg('id') id: string): Promise<Boolean> {
        try {
            await LeagueRepository.delete(id)
            return true
        } catch (e) {
            throw new Error(e.message)
        }
    }
}
