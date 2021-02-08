import { BaseFirestoreRepository } from 'fireorm'
import { initialize } from 'fireorm/lib/src/MetadataStorage'
import { ID, Int } from 'type-graphql'

const MockFirebase = require('mock-cloud-firestore')
const fixtureData = {
    __collection__: {
        leagueRegistration: {
            __doc__: {
                DqEhYylTEbHiGNkRflaP: {
                    dateRegistered: new Date('2021-01-17T03:24:00'),
                    id: 'DqEhYylTEbHiGNkRflaP',
                    isActive: true,
                    leagueId: 'sEREsBNeOM16BtRaSbzv',
                    seasonId: 'DDqVvYGHKX4ayl97qrfy',
                    userId: 'vhPn3q0IqaNSZwWFEHAykEsEVYd2',
                },
            },
        },
    },
}

const getRegistrationByUser = `
    query GetRegistrationsByUser($userId: String!) {
        returnLeagueRegistrationByUser(userId: $userId) {
            leagueId,
            seasonId,
            dateRegistered,
            userId,
            isActive
        }
    }
`

const getRegistrationBySeason = `
    query GetRegistrationsBySeason($seasonId: String!) {
        returnLeagueRegistrationBySeason(seasonId: $seasonId) {
            leagueId,
            seasonId,
            dateRegistered,
            userId,
            isActive
        }
    }
`

const getRegistrationByLeague = `
    query GetRegistrationsByLeague($leagueId: String!) {
        returnLeagueRegistrationByLeague(leagueId: $leagueId) {
            leagueId,
            seasonId,
            dateRegistered,
            userId,
            isActive
        }
    }
`

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

    it('returns a season by a valid user id', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const response = await graphqlCall({
            source: getRegistrationByUser,
            variableValues: {
                userId: 'vhPn3q0IqaNSZwWFEHAykEsEVYd2',
            },
        })
        expect(response.data.returnLeagueRegistrationByUser.length).toBe(1)
    })
    it('returns a season by a valid seaon id', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const response = await graphqlCall({
            source: getRegistrationBySeason,
            variableValues: {
                seasonId: 'DDqVvYGHKX4ayl97qrfy',
            },
        })
        expect(response.data.returnLeagueRegistrationBySeason.length).toBe(1)
    })

    it('returns a league by a valid seaon id', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const response = await graphqlCall({
            source: getRegistrationByLeague,
            variableValues: {
                leagueId: 'sEREsBNeOM16BtRaSbzv',
            },
        })
        expect(response.data.returnLeagueRegistrationByLeague.length).toBe(1)
    })
})
