import { initialize } from 'fireorm/lib/src/MetadataStorage'
const MockFirebase = require('mock-cloud-firestore')

const fixtureData = {
    __collection__: {
        users: {
            __doc__: {
                AUsewNSXhRJuoKZoqiqdgIDWHp2: {
                    id: 'AUsewNSXhRJuoKZoqiqdgIDWHp2',
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
    },
}

describe('User Resolver', () => {
    beforeEach(() => {
        const firebase = new MockFirebase(fixtureData)
        const firestore = firebase.firestore()
        initialize(firestore)
    })

    const createUserMutation = `
        mutation CreateUser($data:UserInput!) {
            createUser(data: $data) {
                firstName
                lastName
                email
                username
                id
                loginProvider
                defaultAvatarThemeIndex
            }
        }
    `
    const updateUserMutation = `
        mutation UpdateUser($data: UserUpdateInput!) {
            updateUser(data: $data) {
                firstName
                lastName
                email
                username
                id
                loginProvider
                defaultAvatarThemeIndex
            }
        }
    `
    const removesUserMutation = `
        mutation RemoveUser($id: String!) {
            removeSingleUser(id: $id) 
        }
    `
    const getAllUsersQuery = `
        {
            returnAllUsers{
                username
                firstName
                lastName
                id
            }
        }
    `
    const getUserByIdQuery = `
        query getAllUsersQuery($Id: String!) {
            returnSingleUser(id:$Id){
                lastName
                firstName
            }
        }
    `

    it('returns correct number of records from querying all', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')

        const response = await graphqlCall({
            source: getAllUsersQuery,
        })
        expect(response.data.returnAllUsers.length).toBe(2)
    })
    it('returns the correct user when their id is provided', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')

        const response = await graphqlCall({
            source: getUserByIdQuery,
            variableValues: {
                Id: 'AUsewNSXhRJuoKZoqiqdgIDWHp2',
            },
        })

        expect(response.data.returnSingleUser.firstName).toBe('Homer')
    })
    it('is a resolver of type User', () => {
        const { resolveUser } = require('../UserResolver')
        const { User } = require('../UserEntity')
        expect(resolveUser()).toBe(User)
    })
    it('removes a user', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')

        const responseBefore = await graphqlCall({
            source: getAllUsersQuery,
        })

        expect(responseBefore.data.returnAllUsers.length).toBe(2)
        const userIdToRemove = 'QUsewNSXhRJuoKZoqiqdgIDWHp2'

        const responseRemove = await graphqlCall({
            source: removesUserMutation,
            variableValues: {
                id: userIdToRemove,
            },
        })

        const responseAfter = await graphqlCall({
            source: getAllUsersQuery,
        })

        expect(responseAfter.data.returnAllUsers.length).toBe(1)
    })

    it('throws an error if invalid ID when updating a user', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const userId = '111AUsewddNSXhRJuoKZoqiqdgIDWHp2'
        const user = {
            id: userId,
            firstName: 'Herb',
            lastName: 'Powell',
            email: 'hpowell@kompany.zone',
            username: 'hpowell',
            profileImageName: '',
            city: '',
            state: '',
            zip: '',
        }
        const response = await graphqlCall({
            source: updateUserMutation,
            variableValues: {
                data: user,
            },
        })

        expect(response.data).toBe(null)
        expect(response.errors.length).toBeGreaterThan(0)
    })
    it('creates a user', async () => {
        // graphql
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const user = {
            id: 'sdfasdfasdf',
            firstName: 'lisa',
            lastName: 'simpson',
            email: 'lsimpson@gmail.com',
            username: 'lsimpson',
            defaultAvatarThemeIndex: 0,
            loginProvider: 'email',
            profileImageName: '',
            city: '',
            state: '',
            zip: '',
        }
        const response = await graphqlCall({
            source: createUserMutation,
            variableValues: {
                data: user,
            },
        })
        expect(response.data.createUser).toMatchObject({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            defaultAvatarThemeIndex: user.defaultAvatarThemeIndex,
            loginProvider: user.loginProvider,
        })
    })

    it('updates a user', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const userId = 'AUsewNSXhRJuoKZoqiqdgIDWHp2'
        const user = {
            id: userId,
            firstName: 'Herb',
            lastName: 'Powell',
            email: 'hpowell@kompany.zone',
            username: 'hpowell',
            profileImageName: '',
            city: '',
            state: '',
            zip: '',
        }
        const response = await graphqlCall({
            source: updateUserMutation,
            variableValues: {
                data: user,
            },
        })

        expect(response.data.updateUser).toMatchObject({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        })
    })

    it('throws an error for a duplicate email when creating a new user', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const user = {
            id: 'sdfasdfasdf',
            firstName: 'homer',
            lastName: 'simpson',
            email: 'hsimpson@springfieldpower.com',
            username: 'homer_simpson',
            defaultAvatarThemeIndex: 0,
            loginProvider: 'email',
            profileImageName: '',
            city: '',
            state: '',
            zip: '',
        }
        const response = await graphqlCall({
            source: createUserMutation,
            variableValues: {
                data: user,
            },
        })
        expect(response.errors.length).toBeGreaterThan(0)
    })

    it('throws an error for a duplicate username when creating a new user', async () => {
        const { graphqlCall } = require('../../../../test-utils/graphqlCall')
        const user = {
            id: 'sdfasdfasdf',
            firstName: 'homer',
            lastName: 'simpson',
            email: 'homer_simposon@springfieldpower.com',
            username: 'hsimpson',
            defaultAvatarThemeIndex: 0,
            loginProvider: 'email',
            profileImageName: '',
            city: '',
            state: '',
            zip: '',
        }
        const response = await graphqlCall({
            source: createUserMutation,
            variableValues: {
                data: user,
            },
        })
        expect(response.errors.length).toBeGreaterThan(0)
    })
})
