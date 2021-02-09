import { BaseFirestoreRepository } from 'fireorm'
import { initialize } from 'fireorm/lib/src/MetadataStorage'

const MockFirebase = require('mock-cloud-firestore')
const expectedUserId = 'AUsewNSXhRJuoKZoqiqdgIDWHp2'

const fixtureData = {
    __collection__: {
        leagueRegistration: {
            __doc__: {
                DqEhYylTEbHiGNkRflaP: {
                    dateRegistered: new Date('2021-01-17T03:24:00'),
                    id: 'DqEhYylTEbHiGNkRflaP',
                    isActive: true,
                    leagueId: 'BQzNm7DPdpInAy6sRCxL',
                    seasonId: 'AAqVvYGHKX4ayl97qrfy',
                    userId: expectedUserId,
                },
            },
        },
        users: {
            __doc__: {
                [expectedUserId]: {
                    id: expectedUserId,
                    firstName: 'Homer',
                    lastName: 'Simpson',
                    username: 'hsimpson',
                    email: 'hsimpson@springfieldpower.com',
                    loginProvider: 'email',
                    defaultAvatarThemeIndex: 0,
                },
                QUsewNSXhRJuoKZoqiqdgIDWHp2: {
                    id: 'QUsewNSXhRJuoKZoqiqdgIDWHp2',
                    firstName: 'Marge',
                    lastName: 'Simpson',
                    username: 'msimpson',
                    email: 'msimpson@springfield.net',
                    loginProvider: 'google',
                    defaultAvatarThemeIndex: 0,
                },
            },
        },
        seasons: {
            __doc__: {
                AAqVvYGHKX4ayl97qrfy: {
                    id: 'AAqVvYGHKX4ayl97qrfy',
                    leagueId: 'BQzNm7DPdpInAy6sRCxL',
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

const createLeagueRegistration = `
    mutation CreateLeagueRegistration($data: LeagueRegistrationInput!){
        createLeagueRegistration(data: $data) {
            userId,
            seasonId,
            leagueId,
            id,
            dateRegistered,
            isActive
        }
}
`

const updateLeagueRegistration = `
    mutation UpdateLeagueRegistration($data: LeagueRegistrationUpdateInput!){
        updateLeagueRegistration(data: $data) {
            leagueId
            seasonId
            userId
            dateRegistered
            isActive
        }
    }
`

describe('League Registration Resolver', () => {
    beforeEach(() => {
        const firebase = new MockFirebase(fixtureData)
        const firestore = firebase.firestore()
        initialize(firestore)
    })

    it('returns a season by a valid user id', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const response = await graphqlCall({
            source: getRegistrationByUser,
            variableValues: {
                userId: expectedUserId,
            },
        })
        expect(response.data.returnLeagueRegistrationByUser.length).toBe(1)
    })
    it('returns a season by a valid seaon id', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const response = await graphqlCall({
            source: getRegistrationBySeason,
            variableValues: {
                seasonId: 'AAqVvYGHKX4ayl97qrfy',
            },
        })
        expect(response.data.returnLeagueRegistrationBySeason.length).toBe(1)
    })

    it('returns a league by a valid seaon id', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const response = await graphqlCall({
            source: getRegistrationByLeague,
            variableValues: {
                leagueId: 'BQzNm7DPdpInAy6sRCxL',
            },
        })
        expect(response.data.returnLeagueRegistrationByLeague.length).toBe(1)
    })

    it('is a resolver of type LeagueRegistration', () => {
        const { resolveLeagueRegistration } = require('../LeagueRegistrationResolver')
        const { LeagueRegistration } = require('../LeagueRegistrationEntity')

        expect(resolveLeagueRegistration()).toBe(LeagueRegistration)
    })
    it('creates a league registration', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const leagueRegistration = {
            leagueId: 'DDqVvYGHKX4ayl97qrfy',
            seasonId: 'JJqVvYGHKX4ayl97qrfy',
            userId: 'QUsewNSXhRJuoKZoqiqdgIDWHp2',
        }
        const response = await graphqlCall({
            source: createLeagueRegistration,
            variableValues: {
                data: leagueRegistration,
            },
        })
        expect(response.data.createLeagueRegistration).toMatchObject({
            isActive: true,
            leagueId: leagueRegistration.leagueId,
            seasonId: leagueRegistration.seasonId,
            userId: leagueRegistration.userId,
        })
    })
    it('sets a registration to inactive', async () => {
        // updateLeagueRegistration
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const leagueRegistrationUpdate = {
            id: 'DqEhYylTEbHiGNkRflaP',
            isActive: false,
        }
        const response = await graphqlCall({
            source: updateLeagueRegistration,
            variableValues: {
                data: leagueRegistrationUpdate,
            },
        })
        expect(response.data.updateLeagueRegistration).toMatchObject({
            dateRegistered: new Date('2021-01-17T03:24:00').toISOString(),
            isActive: false,
            leagueId: 'BQzNm7DPdpInAy6sRCxL',
            seasonId: 'AAqVvYGHKX4ayl97qrfy',
            userId: expectedUserId,
        })
    })
})
