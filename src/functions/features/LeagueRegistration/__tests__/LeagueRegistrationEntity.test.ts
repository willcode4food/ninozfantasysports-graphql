import { BaseFirestoreRepository } from 'fireorm'
import { initialize } from 'fireorm/lib/src/MetadataStorage'
import { ID } from 'type-graphql'

const MockFirebase = require('mock-cloud-firestore')
const expectedUserId = 'AUsewNSXhRJuoKZoqiqdgIDWHp2'
const expectedLeagueRegistrationId = 'DqEhYylTEbHiGNkRflaP'
const expectedLeagueId = 'BQzNm7DPdpInAy6sRCxL'
const expectedSeasonId = 'AAqVvYGHKX4ayl97qrfy'

const fixtureData = {
    __collection__: {
        leagueRegistration: {
            __doc__: {
                DqEhYylTEbHiGNkRflaP: {
                    dateRegistered: new Date('2021-01-17T03:24:00'),
                    id: expectedLeagueRegistrationId,
                    isActive: true,
                    leagueId: expectedLeagueId,
                    seasonId: expectedSeasonId,
                    userId: expectedUserId,
                },
            },
        },
    },
}

describe('League Registration Entity Repository', () => {
    beforeEach(() => {
        const firebase = new MockFirebase(fixtureData)
        const firestore = firebase.firestore()
        initialize(firestore)
    })
    it('should be an instance of BaseRespository', () => {
        const { LeagueRegistrationRepository } = require('../LeagueRegistrationEntity')
        expect(LeagueRegistrationRepository).toBeInstanceOf(BaseFirestoreRepository)
    })
    it('has decorators that return correct types', () => {
        const { returnId } = require('../LeagueRegistrationEntity')
        expect(returnId()).toBe(ID)
    })
    it('returns a league registration with leagueId, userId, seasonId, registration date, and isActive flag ', async () => {
        const { LeagueRegistrationRepository } = require('../LeagueRegistrationEntity')
        const leagueRegistration = await LeagueRegistrationRepository.findById(expectedLeagueRegistrationId)
        expect(leagueRegistration.id).toBe(expectedLeagueRegistrationId)
        expect(leagueRegistration.leagueId).toBe(expectedLeagueId)
        expect(leagueRegistration.seasonId).toBe(expectedSeasonId)
        expect(leagueRegistration.userId).toBe(expectedUserId)
        expect(leagueRegistration.isActive).toBe(true)
        expect(leagueRegistration.dateRegistered).toBeDefined()
    })
    it('creates a new league registration', async () => {
        const { LeagueRegistration, LeagueRegistrationRepository } = require('../LeagueRegistrationEntity')
        const entity = new LeagueRegistration()
        entity.id = 'AdAsdfsadgf2233'
        entity.leagueId = expectedLeagueId
        entity.seasonId = expectedSeasonId
        entity.userId = 'a3aAadd3Ddgaggga'

        const leagueRegistration = await LeagueRegistrationRepository.create(entity)
        expect(leagueRegistration).toBeInstanceOf(LeagueRegistration)
        expect(leagueRegistration.leagueId).toBe(expectedLeagueId)
        expect(leagueRegistration.seasonId).toBe(expectedSeasonId)
        expect(leagueRegistration.leagueId).toBe(expectedLeagueId)
    })
})
