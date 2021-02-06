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

describe('Email Exists Input Validator - Custom Decorator', () => {
    beforeEach(() => {
        const firebase = new MockFirebase(fixtureData)
        const firestore = firebase.firestore()
        initialize(firestore)
    })

    it('returns true if email already exists', async () => {
        const { IsNotEmailAlreadyExistsConstraint } = require('../IsNotEmailAlreadyExistsDecorator')
        const isEmailAlreadyExist = await IsNotEmailAlreadyExistsConstraint.prototype.validate(
            'hsimpson@springfieldpower.com'
        )
        expect(isEmailAlreadyExist).toBe(false)
    })
    it('returns false if email does not exist', async () => {
        const { IsNotEmailAlreadyExistsConstraint } = require('../IsNotEmailAlreadyExistsDecorator')
        const isEmailAlreadyExist = await IsNotEmailAlreadyExistsConstraint.prototype.validate(
            'lsimpson@springfieldpower.com'
        )
        expect(isEmailAlreadyExist).toBe(true)
    })
})
