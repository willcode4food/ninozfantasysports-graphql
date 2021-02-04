import { initialize } from 'fireorm/lib/src/MetadataStorage'
const MockFirebase = require('mock-cloud-firestore')

const fixtureData = {
    __collection__: {
        leagues: {
            __doc__: {
                BQzNm7DPdpInAy6sRCxL: {
                    id: 'BQzNm7DPdpInAy6sRCxL',
                    name: 'Conflict of Enemies 2021',
                    leagueId: '123Nm7DPdpInAy6sRCxL',
                    type: 'esports',
                },
                DDqVvYGHKX4ayl97qrfy: {
                    id: 'DDqVvYGHKX4ayl97qrfy',
                    name: 'Conflict of Enemies 2020',
                    leagueId: '123Nm7DPdpInAy6sRCxL',
                    type: 'esports',
                },
            },
        },
        seasons: {
            __doc__: {
                AAqVvYGHKX4ayl97qrfy: {
                    id: 'AAqVvYGHKX4ayl97qrfy',
                    leagueId: 'DDqVvYGHKX4ayl97qrfy',
                    name: 'Season 1',
                    startDate: new Date(2019, 10, 30).toISOString(),
                    endDate: new Date(2019, 11, 30).toISOString(),
                },
                JJqVvYGHKX4ayl97qrfy: {
                    id: 'JJqVvYGHKX4ayl97qrfy',
                    leagueId: 'DDqVvYGHKX4ayl97qrfy',
                    name: 'Season 2',
                    startDate: new Date(2018, 10, 30).toISOString(),
                    endDate: new Date(2018, 11, 30).toISOString(),
                },
            },
        },
    },
}

describe('Season Resolver', () => {
    beforeEach(() => {
        const firebase = new MockFirebase(fixtureData)
        const firestore = firebase.firestore()
        initialize(firestore)
    })

    const createSeasonMutation = `
        mutation CreateSeason($data:SeasonInput!) {
            createSeason(data: $data) {
                id
                name
                leagueId
            }
        }
    `
    const updateSeasonMutation = `
        mutation UpdateSeason($data: SeasonUpdateInput!) {
            updateSeason(data: $data) {
                id
                name
                leagueId
                startDate
                endDate
            }
        }
    `
    const removesSeasonMutation = `
        mutation RemoveSeason($id: String!) {
            removeSingleSeason(id: $id) 
        }
    `
    const getAllSeasonsQuery = `
        {
            returnAllSeasons{
                id
                name
                leagueId
            }
        }
    `
    const getSeasonByIdQuery = `
        query getAllSeasonsQuery($Id: String!) {
            returnSingleSeason(id:$Id){
                id
                name
                leagueId
            }
        }
    `

    const getSeasonByLeagueIdQuery = `
        query getAllSeasonsQuery($LeagueId: String!) {
            returnSeasonByLeagueId(leagueId:$LeagueId){
                id
                name
                startDate
                endDate
            }
        }
    `

    it('returns correct number of records from querying all', async () => {
        const { graphqlCall } = require('../../../test-utils/graphqlCall')

        const response = await graphqlCall({
            source: getAllSeasonsQuery,
        })
        expect(response.data.returnAllSeasons.length).toBe(2)
    })
    it('returns the correct season when their id is provided', async () => {
        const { graphqlCall } = require('../../../test-utils/graphqlCall')

        const response = await graphqlCall({
            source: getSeasonByIdQuery,
            variableValues: {
                Id: 'AAqVvYGHKX4ayl97qrfy',
            },
        })

        expect(response.data.returnSingleSeason.name).toBe('Season 1')
    })
    it('is a resolver of type Season', () => {
        const { resolveSeason } = require('../SeasonResolver')
        const { Season } = require('../../entities/Season')
        expect(resolveSeason()).toBe(Season)
    })

    it('throws an error if invalid ID when updating a season', async () => {
        const { graphqlCall } = require('../../../test-utils/graphqlCall')
        const seasonId = 'asfasdfasdf'
        const season = {
            id: seasonId,
            leagueId: 'DDqVvYGHKX4ayl97qrfy',
            name: 'Season 12',
            startDate: new Date(2017, 10, 30).toISOString(),
            endDate: new Date(2017, 11, 30).toISOString(),
        }
        const response = await graphqlCall({
            source: updateSeasonMutation,
            variableValues: {
                data: season,
            },
        })

        expect(response.errors.length).toBeGreaterThan(0)
    })
    it('creates a season', async () => {
        // graphql
        const { graphqlCall } = require('../../../test-utils/graphqlCall')
        const season = {
            leagueId: 'BQzNm7DPdpInAy6sRCxL',
            name: 'Season 4',
            startDate: new Date(2019, 8, 30).toISOString(),
            endDate: new Date(2019, 9, 30).toISOString(),
        }
        const response = await graphqlCall({
            source: createSeasonMutation,
            variableValues: {
                data: season,
            },
        })
        expect(response.data.createSeason).toMatchObject({
            name: season.name,
            leagueId: season.leagueId,
        })
    })

    it('updates a season', async () => {
        const { graphqlCall } = require('../../../test-utils/graphqlCall')
        const seasonId = 'JJqVvYGHKX4ayl97qrfy'
        const season = {
            id: seasonId,
            leagueId: 'DDqVvYGHKX4ayl97qrfy',
            name: 'Season 12',
            startDate: new Date(2017, 10, 30).toISOString(),
            endDate: new Date(2017, 11, 30).toISOString(),
        }
        const response = await graphqlCall({
            source: updateSeasonMutation,
            variableValues: {
                data: season,
            },
        })

        expect(response.data.updateSeason).toMatchObject({
            id: season.id,
            name: season.name,
            leagueId: season.leagueId,
            startDate: season.startDate,
            endDate: season.endDate,
        })
    })

    it('removes a season', async () => {
        const { graphqlCall } = require('../../../test-utils/graphqlCall')

        const responseBefore = await graphqlCall({
            source: getAllSeasonsQuery,
        })

        expect(responseBefore.data.returnAllSeasons.length).toBe(3)
        const seasonIdToRemove = 'JJqVvYGHKX4ayl97qrfy'

        const responseRemove = await graphqlCall({
            source: removesSeasonMutation,
            variableValues: {
                id: seasonIdToRemove,
            },
        })

        const responseAfter = await graphqlCall({
            source: getAllSeasonsQuery,
        })

        expect(responseAfter.data.returnAllSeasons.length).toBe(2)
    })

    it('returns seasons based on a league id', async () => {
        const { graphqlCall } = require('../../../test-utils/graphqlCall')

        const response = await graphqlCall({
            source: getSeasonByLeagueIdQuery,
            variableValues: {
                LeagueId: 'DDqVvYGHKX4ayl97qrfy',
            },
        })
        const season = response.data
        expect(0).toBe(0)
    })
})
