import { BaseFirestoreRepository } from 'fireorm'
import { initialize } from 'fireorm/lib/src/MetadataStorage'

const MockFirebase = require('mock-cloud-firestore')
const seasonId = 'AUsewNSXhRJuoKZoqiqdgIDWHp2'
const leagueId = 'BQzNm7DPdpInAy6sRCxL'
const seasonName = 'Season 1'
const startDate = new Date('2020-11-17T03:24:00')
const endDate = new Date('2020-12-17T03:24:00')

const fixtureData = {
    __collection__: {
        seasons: {
            __doc__: {
                AUsewNSXhRJuoKZoqiqdgIDWHp2: {
                    id: seasonId,
                    leagueId,
                    name: seasonName,
                    startDate,
                    endDate,
                },
            },
        },
    },
}
describe('Season Entity Repository', () => {
    beforeEach(() => {
        const firebase = new MockFirebase(fixtureData)
        const firestore = firebase.firestore()
        initialize(firestore)
    })
    it('should be an instance of BaseRespository', () => {
        const { SeasonRepository } = require('../Season')
        expect(SeasonRepository).toBeInstanceOf(BaseFirestoreRepository)
    })
    it('returns a season with name, start date and end date for the given ID', async () => {
        const { SeasonRepository } = require('../Season')
        const Season = await SeasonRepository.findById(seasonId)
        expect(Season.id).toBe(seasonId)
        expect(Season.name).toBe(seasonName)
        expect(Season.leagueId).toBe(leagueId)
        expect(Season.startDate.toString()).toBe(startDate.toString())
        expect(Season.endDate.toString()).toBe(endDate.toString())
    })
    it('will create a new season', async () => {
        const { SeasonRepository, Season } = require('../Season')
        const expectedId = 'OoUsewNSXhRJuoKZoqiqdgIDWHp2'
        const expectedSeasonName = 'Season 2'
        const expectedStartDate = new Date('2020-01-17T03:24:00')
        const expectedEndDate = new Date('2020-02-17T03:24:00')
        const expectedLeagueId = '232sewNSXhRJuoKZoqiqdgIDWHp2'

        const entity = new Season()
        entity.id = expectedId
        entity.name = expectedSeasonName
        entity.startDate = expectedStartDate
        entity.endDate = expectedEndDate
        entity.leagueId = expectedLeagueId

        const season = await SeasonRepository.create(entity)
        expect(season).toBeInstanceOf(Season)
        expect(season.name).toBe(expectedSeasonName)
        expect(season.startDate).toBe(expectedStartDate)
        expect(season.endDate).toBe(expectedEndDate)
        expect(season.leagueId).toBe(expectedLeagueId)
    })
    it('will update a season with the correct data', async () => {
        const { SeasonRepository } = require('../Season')
        const expectedEndDate = new Date('2020-12-04T03:24:00')
        const seasonToUpdate = await SeasonRepository.findById(seasonId)
        expect(seasonToUpdate.endDate.toString()).toBe(endDate.toString())
        seasonToUpdate.endDate = expectedEndDate
        const updatedSeason = await SeasonRepository.update(seasonToUpdate)
        expect(updatedSeason.endDate).toBe(expectedEndDate)
    })
})
