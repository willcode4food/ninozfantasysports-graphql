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
                },
            },
        },
    },
}

describe('Username Exists Input Validator - Custom Decorator', () => {
    beforeEach(() => {
        const firebase = new MockFirebase(fixtureData)
        const firestore = firebase.firestore()
        initialize(firestore)
    })

    it('returns true if username already exists', async () => {
        const { IsNotUsernameAlreadyExistsConstraint } = require('../IsNotUsernameAlreadyExists')
        const isUsernameAlreadyExist = await IsNotUsernameAlreadyExistsConstraint.prototype.validate('hsimpson')
        expect(isUsernameAlreadyExist).toBe(false)
    })
    it('returns false if username does not exist', async () => {
        const { IsNotUsernameAlreadyExistsConstraint } = require('../IsNotUsernameAlreadyExists')
        const isUsernameAlreadyExist = await IsNotUsernameAlreadyExistsConstraint.prototype.validate('lsimpson')
        expect(isUsernameAlreadyExist).toBe(true)
    })
})
