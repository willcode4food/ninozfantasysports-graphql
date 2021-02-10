import { initialize } from 'fireorm/lib/src/MetadataStorage'
const MockFirebase = require('mock-cloud-firestore')

const fixtureData = {
    __collection__: {
        leagues: {
            __doc__: {
                BQzNm7DPdpInAy6sRCxL: {
                    id: 'BQzNm7DPdpInAy6sRCxL',
                    description: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                        culpa qui officia deserunt mollit anim id est laborum."`,
                    name: 'Conflict of Enemies 2021',
                    ownerId: 'a123Nm7DPdpInAy6sRCxL',
                    type: 'esports',
                },
                DDqVvYGHKX4ayl97qrfy: {
                    id: 'DDqVvYGHKX4ayl97qrfy',
                    description: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                        culpa qui officia deserunt mollit anim id est laborum."`,
                    name: 'Conflict of Enemies 2020',
                    ownerId: 'a123Nm7DPdpInAy6sRCxL',
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
                },
                JJqVvYGHKX4ayl97qrfy: {
                    id: 'JJqVvYGHKX4ayl97qrfy',
                    leagueId: 'DDqVvYGHKX4ayl97qrfy',
                    name: 'Season 2',
                },
            },
        },
        users: {
            __doc__: {
                a123Nm7DPdpInAy6sRCxL: {
                    id: 'a123Nm7DPdpInAy6sRCxL',
                    username: 'elbarto',
                },
            },
        },
    },
}

describe('League Resolver', () => {
    beforeEach(() => {
        const firebase = new MockFirebase(fixtureData)
        const firestore = firebase.firestore()
        initialize(firestore)
    })

    const createLeagueMutation = `
        mutation CreateLeague($data:LeagueInput!) {
            createLeague(data: $data) {
                id
                description
                name
                ownerId
                type
            }
        }
    `
    const updateLeagueMutation = `
        mutation UpdateLeague($data: LeagueUpdateInput!) {
            updateLeague(data: $data) {
                id
                description
                name
                ownerId
                type
            }
        }
    `
    const removesLeagueMutation = `
        mutation RemoveLeague($id: String!) {
            removeSingleLeague(id: $id) 
        }
    `
    const getAllLeaguesQuery = `
        {
            returnAllLeagues{
                id
                description
                name
                ownerId
                type
            }
        }
    `
    const getLeagueByIdQuery = `
        query getAllLeaguesQuery($Id: String!) {
            returnSingleLeague(id:$Id){
                id
                name
                ownerId
                type
            }
        }
    `

    it('returns correct number of records from querying all', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')

        const response = await graphqlCall({
            source: getAllLeaguesQuery,
        })
        expect(response.data.returnAllLeagues.length).toBe(2)
    })
    it('returns the correct league when their id is provided', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')

        const response = await graphqlCall({
            source: getLeagueByIdQuery,
            variableValues: {
                Id: 'DDqVvYGHKX4ayl97qrfy',
            },
        })

        expect(response.data.returnSingleLeague.name).toBe('Conflict of Enemies 2020')
    })
    it('is a resolver of type League', () => {
        const { resolveLeague } = require('../LeagueResolver')
        const { League } = require('../LeagueEntity')
        expect(resolveLeague()).toBe(League)
    })
    it('removes a league', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')

        const responseBefore = await graphqlCall({
            source: getAllLeaguesQuery,
        })

        expect(responseBefore.data.returnAllLeagues.length).toBe(2)
        const leagueIdToRemove = 'DDqVvYGHKX4ayl97qrfy'

        const responseRemove = await graphqlCall({
            source: removesLeagueMutation,
            variableValues: {
                id: leagueIdToRemove,
            },
        })

        const responseAfter = await graphqlCall({
            source: getAllLeaguesQuery,
        })

        expect(responseAfter.data.returnAllLeagues.length).toBe(1)
    })

    it('throws an error if invalid ID when updating a league', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const leagueId = '111AUsewddNSXhRJuoKZoqiqdgIDWHp2'
        const league = {
            id: leagueId,
            name: 'Fantasy Football 2020',
            description: `At vero eos et accusamus et iusto odio dignissimos
                ducimus qui blanditiis praesentium voluptatum deleniti atque 
                corrupti quos dolores et quas molestias excepturi sint occaecati 
                cupiditate non provident, similique sunt in culpa qui officia 
                deserunt mollitia animi, id est laborum et dolorum fuga. Et harum 
                quidem rerum facilis est et expedita distinctio. Nam libero tempore, 
                cum soluta nobis est eligendi optio cumque nihil impedit quo minus 
                id quod maxime placeat facere possimus, omnis voluptas assumenda est, 
                omnis dolor repellendus. Temporibus autem quibusdam et aut officiis 
                debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae 
                sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente 
                delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut 
                perferendis doloribus asperiores repellat.`,
            ownerId: '123213123',
            type: 'football',
        }
        const response = await graphqlCall({
            source: updateLeagueMutation,
            variableValues: {
                data: league,
            },
        })

        expect(response.errors.length).toBeGreaterThan(0)
    })
    it('creates a league', async () => {
        // graphql
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const league = {
            description: `At vero eos et accusamus et iusto odio dignissimos
                ducimus qui blanditiis praesentium voluptatum deleniti atque 
                corrupti quos dolores et quas molestias excepturi sint occaecati 
                cupiditate non provident, similique sunt in culpa qui officia 
                deserunt mollitia animi, id est laborum et dolorum fuga. Et harum 
                quidem rerum facilis est et expedita distinctio. Nam libero tempore, 
                cum soluta nobis est eligendi optio cumque nihil impedit quo minus 
                id quod maxime placeat facere possimus, omnis voluptas assumenda est, 
                omnis dolor repellendus. Temporibus autem quibusdam et aut officiis 
                debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae 
                sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente 
                delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut 
                perferendis doloribus asperiores repellat.`,
            name: 'Fantasy Floor Hockey 2020',
            ownerId: '123213123',
            type: 'hockey',
        }
        const response = await graphqlCall({
            source: createLeagueMutation,
            variableValues: {
                data: league,
            },
        })
        expect(response.data.createLeague).toMatchObject({
            name: league.name,
            ownerId: league.ownerId,
            type: league.type,
        })
    })

    it('updates a league', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const leagueId = 'BQzNm7DPdpInAy6sRCxL'
        const league = {
            id: leagueId,
            description: `At vero eos et accusamus et iusto odio dignissimos
                ducimus qui blanditiis praesentium voluptatum deleniti atque 
                corrupti quos dolores et quas molestias excepturi sint occaecati 
                cupiditate non provident, similique sunt in culpa qui officia 
                deserunt mollitia animi, id est laborum et dolorum fuga. Et harum 
                quidem rerum facilis est et expedita distinctio. Nam libero tempore, 
                cum soluta nobis est eligendi optio cumque nihil impedit quo minus 
                id quod maxime placeat facere possimus, omnis voluptas assumenda est, 
                omnis dolor repellendus. Temporibus autem quibusdam et aut officiis 
                debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae 
                sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente 
                delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut 
                perferendis doloribus asperiores repellat.`,
            name: 'Fantasy Floor Hockey 2020',
            ownerId: '123213123',
            type: 'hockey',
        }
        const response = await graphqlCall({
            source: updateLeagueMutation,
            variableValues: {
                data: league,
            },
        })
        expect(response.data.updateLeague).toMatchObject({
            id: league.id,
            description: league.description,
            name: league.name,
            ownerId: league.ownerId,
            type: league.type,
        })
    })
})
