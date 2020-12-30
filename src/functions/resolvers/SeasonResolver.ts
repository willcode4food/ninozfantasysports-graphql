import { League } from 'functions/entites/League'
import { Mutation, Arg, Query, Resolver } from 'type-graphql'
import { Season, SeasonRepository } from '../entites/Season'
import { SeasonInput } from './types'

@Resolver((_of) => Season)
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
        @Arg('data', { validate: true }) { name, startDate, endDate, leagueId }: SeasonInput
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
            console.log(e.message)
            return season
        }

        return season
    }

    @Mutation(() => Season)
    async updateSeason(
        @Arg('data', { validate: true }) { id, name, startDate, endDate, leagueId }: SeasonInput
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
            seasonToUpdate.name = name || seasonToUpdate.name
            seasonToUpdate.startDate = startDate || seasonToUpdate.startDate
            seasonToUpdate.endDate = endDate || seasonToUpdate.endDate
            seasonToUpdate.leagueId = leagueId || seasonToUpdate.leagueId
            seasonToUpdate.dateUpdated = new Date()
            season = await SeasonRepository.update(seasonToUpdate)
            return season
        } catch (e) {
            console.log(e.message)
            throw new TypeError()
        }
    }
}
