import { BaseFirestoreRepository } from 'fireorm'
import { initialize } from 'fireorm/lib/src/MetadataStorage'
import { ID, Int } from 'type-graphql'
import { User } from '../UserEntity'

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
                },
            },
        },
    },
}

describe('User Entity Repository', () => {
    beforeEach(() => {
        const firebase = new MockFirebase(fixtureData)
        const firestore = firebase.firestore()
        initialize(firestore)
    })
    it('should be an instance of BaseRespository', () => {
        const { UserEntityRepository } = require('../UserEntity')
        expect(UserEntityRepository).toBeInstanceOf(BaseFirestoreRepository)
    })
    it('has IDs that are the correct type', () => {
        const { returnId, returnInt } = require('../UserEntity')
        expect(returnId()).toBe(ID)
        expect(returnInt()).toBe(Int)
    })
    it('returns a user with first name, last name, username, and email for the given ID', async () => {
        const { UserEntityRepository } = require('../UserEntity')
        const User = await UserEntityRepository.findById('AUsewNSXhRJuoKZoqiqdgIDWHp2')
        expect(User.id).toBe('AUsewNSXhRJuoKZoqiqdgIDWHp2')
        expect(User.firstName).toBe('Homer')
        expect(User.lastName).toBe('Simpson')
        expect(User.username).toBe('hsimpson')
        expect(User.email).toBe('hsimpson@springfieldpower.com')
    })
    it('will create a new User', async () => {
        const { UserEntityRepository, User } = require('../UserEntity')
        const expectedEmail = 'lsimpson@springfield.net'
        const expectedFirstName = 'Lisa'
        const expectedLastName = 'Simpson'
        const expectedUsername = 'lsimpson'
        const expectedId = 'OoUsewNSXhRJuoKZoqiqdgIDWHp2'

        const entity = new User()
        entity.id = expectedId
        entity.email = expectedEmail
        entity.username = expectedUsername
        entity.firstName = expectedFirstName
        entity.lastName = expectedLastName
        const user = await UserEntityRepository.create(entity)
        expect(user).toBeInstanceOf(User)
        expect(user.firstName).toBe(expectedFirstName)
        expect(user.lastName).toBe(expectedLastName)
        expect(user.username).toBe(expectedUsername)
        expect(user.email).toBe(expectedEmail)
    })
    it('will update a user with the correct data', async () => {
        const { UserEntityRepository } = require('../UserEntity')
        const expectedFirstName = 'Marge'
        const userToUpdate = await UserEntityRepository.findById('AUsewNSXhRJuoKZoqiqdgIDWHp2')
        expect(userToUpdate.firstName).toBe('Homer')
        userToUpdate.firstName = expectedFirstName
        const updatedUser = await UserEntityRepository.update(userToUpdate)
        expect(updatedUser.firstName).toBe(expectedFirstName)
    })
})
