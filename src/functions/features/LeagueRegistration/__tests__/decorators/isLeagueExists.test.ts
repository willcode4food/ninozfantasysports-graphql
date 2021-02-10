import { initialize } from 'fireorm/lib/src/MetadataUtils'

const MockFirebase = require('mock-cloud-firestore')

const fixtureData = {
    __collection__: {
        leagues: {
            __doc__: {
                BQzNm7DPdpInAy6sRCxL: {
                    id: 'BQzNm7DPdpInAy6sRCxL',
                    name: 'Conflict of Enemies 2021',
                    leagueId: '123Nm7DPdpInAy6sRCxL',
                    type: 'esports',
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
    it('returns true if league exists', async () => {
        const { IsLeagueIdExistsConstraint } = require('../../decorators/isLeagueIdExists')
        const isLeagueIdExists = await IsLeagueIdExistsConstraint.prototype.validate('BQzNm7DPdpInAy6sRCxL')
        expect(isLeagueIdExists).toBe(true)
    })
    it('returns false if league does not exist', async () => {
        const { IsLeagueIdExistsConstraint } = require('../../decorators/isLeagueIdExists')
        const isLeagueIdExists = await IsLeagueIdExistsConstraint.prototype.validate('123456')
        expect(isLeagueIdExists).toBe(false)
    })
})
