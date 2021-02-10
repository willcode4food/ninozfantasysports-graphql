import { initialize } from 'fireorm/lib/src/MetadataUtils'

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

describe('Leaague Exists Input Validator - Custom Decorator', () => {
    beforeEach(() => {
        const firebase = new MockFirebase(fixtureData)
        const firestore = firebase.firestore()
        initialize(firestore)
    })
    it('returns true if seaon exists', async () => {
        const { IsUserIdExistsConstraint } = require('../../decorators/isUserIdExists')
        const isUserIdExists = await IsUserIdExistsConstraint.prototype.validate('AUsewNSXhRJuoKZoqiqdgIDWHp2')
        expect(isUserIdExists).toBe(true)
    })
    it('returns false if seaon does not exist', async () => {
        const { IsUserIdExistsConstraint } = require('../../decorators/isUserIdExists')
        const isUserIdExists = await IsUserIdExistsConstraint.prototype.validate('123456')
        expect(isUserIdExists).toBe(false)
    })
})
