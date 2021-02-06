import { League } from '../Leagues/LeagueEntity'
import { Mutation, Arg, Query, Resolver } from 'type-graphql'
import { Season, SeasonRepository } from './SeasonEntity'
import SeasonInputType from './SeasonInputType'
import SeasonUpdateInputType from './SeasonUpdateInputType'

export const resolveSeason = () => Season

@Resolver(resolveSeason)
export class SeasonResolver {
    @Query(() => Season, { nullable: false })
    async returnSingleSeason(@Arg('id') id: string): Promise<Season> {
        return await SeasonRepository.findById(id)
    }

    @Query(() => [Season])
    async returnAllSeasons(): Promise<Season[]> {
        return await SeasonRepository.find()
    }

    @Query(() => [Season], { nullable: false })
    async returnSeasonByLeagueId(@Arg('leagueId') leagueId: string): Promise<Season[]> {
        return await SeasonRepository.whereEqualTo('leagueId', leagueId).find()
    }

    @Mutation(() => Season)
    async createSeason(
        @Arg('data', { validate: true }) { name, startDate, endDate, leagueId }: SeasonInputType
    ): Promise<Season> {
        let season: Season = {
            id: '',
            name: '',
            startDate: new Date(),
            endDate: new Date(),
            dateUpdated: new Date(),
            dateCreated: new Date(),
            leagueId: '',
        }
        const entity = new Season()
        entity.name = name
        entity.startDate = startDate
        entity.endDate = endDate
        entity.leagueId = leagueId
        entity.dateCreated = new Date()
        entity.dateUpdated = new Date()
        try {
            season = await SeasonRepository.create(entity)
        } catch (e) {
            throw new Error(e.message)
        }

        return season
    }

    @Mutation(() => Season)
    async updateSeason(
        @Arg('data', { validate: true }) { id, name, startDate, endDate, leagueId }: SeasonUpdateInputType
    ): Promise<Season> {
        let season: Season = {
            id: '',
            name: '',
            startDate: new Date(),
            endDate: new Date(),
            dateUpdated: new Date(),
            dateCreated: new Date(),
            leagueId: '',
        }

        try {
            const seasonToUpdate = await SeasonRepository.findById(id)
            if (!seasonToUpdate) {
                throw new Error('SeasonId is invalid')
            }
            seasonToUpdate.name = name
            seasonToUpdate.startDate = startDate
            seasonToUpdate.endDate = endDate
            seasonToUpdate.leagueId = leagueId
            seasonToUpdate.dateUpdated = new Date()
            season = await SeasonRepository.update(seasonToUpdate)
            return season
        } catch (e) {
            throw new Error(e.message)
        }
    }
    @Mutation(() => Boolean)
    async removeSingleSeason(@Arg('id') id: string): Promise<boolean> {
        try {
            await SeasonRepository.delete(id)
        } catch (e) {
            throw new Error(e.message)
        }

        return true
    }
}
