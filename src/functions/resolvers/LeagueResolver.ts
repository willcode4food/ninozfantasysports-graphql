import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import { League, LeagueRepository } from '../entites/League'
import { Season, SeasonRepository } from '../entites/Season'
import { LeagueInput, LeagueUpdateInput } from './types'

export const resolveLeague = () => League

@Resolver(resolveLeague)
export class LeagueResolver {
    @Query((_returns) => League, { nullable: false })
    async returnSingleLeague(@Arg('id') id: string): Promise<League> {
        const league = await LeagueRepository.findById(id)
        const seasons = await SeasonRepository.whereEqualTo('leagueId', league.id).find()
        return { ...league, seasons }
    }

    @Query(() => [League])
    async returnAllLeagues(): Promise<League[]> {
        const allLeagues = await LeagueRepository.find()
        const allSeasons = await SeasonRepository.find()
        return allLeagues.map((league) => {
            const seasons = allSeasons.filter((season) => league.id === season.leagueId)
            return { ...league, seasons }
        })
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
            return league
        } catch (e) {
            console.log(e.message)
            throw new TypeError()
        }
    }
    @Mutation(() => League)
    async updateLeague(
        @Arg('data', { validate: true }) { id, name, ownerId, type }: LeagueUpdateInput
    ): Promise<League> {
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
            if (!leagueToUpdate) {
                console.log('LeagueId is invalid')
                throw new TypeError('LeagueId is invalid')
            }
            leagueToUpdate.name = name
            leagueToUpdate.ownerId = ownerId
            leagueToUpdate.type = type
            leagueToUpdate.dateUpdated = new Date()
            league = await LeagueRepository.update(leagueToUpdate)
            return league
        } catch (e) {
            console.log(e.message)
            throw new TypeError()
        }
    }
    @Mutation(() => Boolean)
    async removeSingleLeague(@Arg('id') id: string): Promise<boolean> {
        await LeagueRepository.delete(id)
        return true
    }
}
