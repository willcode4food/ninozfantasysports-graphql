import { BaseFirestoreRepository } from 'fireorm'
import { initialize } from 'fireorm/lib/src/MetadataStorage'
import { ID } from 'type-graphql'
// import { LeagueRepository } from '../LeagueEntity'

const MockFirebase = require('mock-cloud-firestore')
const expectedLeagueId = 'BQzNm7DPdpInAy6sRCxL'
const expectedLeagueName = 'Springfield Fantasy Baseball'
const expectedOwnerId = 'OoUsewNSXhRJuoKZoqiqdgIDWHp2'
const expectedLeagueType = 'baseball'

const fixtureData = {
    __collection__: {
        leagues: {
            __doc__: {
                BQzNm7DPdpInAy6sRCxL: {
                    id: expectedLeagueId,
                    name: expectedLeagueName,
                    ownerId: expectedOwnerId,
                    type: expectedLeagueType,
                },
            },
        },
    },
}

describe('League Entity Repository', () => {
    beforeEach(() => {
        const firebase = new MockFirebase(fixtureData)
        const firestore = firebase.firestore()
        initialize(firestore)
    })
    it('should be an instance of BaseRespository', () => {
        const { LeagueRepository } = require('../LeagueEntity')
        expect(LeagueRepository).toBeInstanceOf(BaseFirestoreRepository)
    })
    it('has decorators that return correct types', () => {
        const { returnId, returnSeasons } = require('../LeagueEntity')
        const { Season } = require('../../Seasons/SeasonEntity')
        expect(returnId()).toBe(ID)
        expect(returnSeasons()).toMatchObject([Season])
    })
    it('returns a league with name, ownerId and type for a given id', async () => {
        const { LeagueRepository } = require('../LeagueEntity')
        const league = await LeagueRepository.findById(expectedLeagueId)
        expect(league.id).toBe(expectedLeagueId)
        expect(league.name).toBe(expectedLeagueName)
        expect(league.ownerId).toBe(expectedOwnerId)
        expect(league.type).toBe(expectedLeagueType)
    })
    it('creates a new league', async () => {
        const { League, LeagueRepository } = require('../LeagueEntity')
        const entity = new League()
        const expectedNewLeagueId = 'OoUsewNSXhRJuoKZoqiqdgIDWHp2'
        entity.id = expectedNewLeagueId
        entity.ownerId = expectedOwnerId
        entity.name = expectedLeagueName
        entity.type = expectedLeagueType

        const league = await LeagueRepository.create(entity)
        expect(league).toBeInstanceOf(League)
        expect(league.id).toBe(expectedNewLeagueId)
        expect(league.name).toBe(expectedLeagueName)
        expect(league.ownerId).toBe(expectedOwnerId)
        expect(league.type).toBe(expectedLeagueType)
    })
    it('will udpate a league with the correct data', async () => {
        const { LeagueRepository } = require('../LeagueEntity')
        const expectedUpdatedOwnerId = '232sewNSXhRJuoKZoqiqdgIDWHp2'
        const leagueToUpdate = await LeagueRepository.findById(expectedLeagueId)
        expect(leagueToUpdate.ownerId).toBe(expectedOwnerId)
        leagueToUpdate.ownerId = expectedUpdatedOwnerId
        const updatedLeague = await LeagueRepository.update(leagueToUpdate)
        expect(updatedLeague.ownerId).toBe(expectedUpdatedOwnerId)
    })
})
