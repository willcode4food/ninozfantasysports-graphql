import { initialize } from 'fireorm/lib/src/MetadataUtils'

const MockFirebase = require('mock-cloud-firestore')

const fixtureData = {
    __collection__: {
        seasons: {
            __doc__: {
                AAqVvYGHKX4ayl97qrfy: {
                    id: 'AAqVvYGHKX4ayl97qrfy',
                    leagueId: 'BQzNm7DPdpInAy6sRCxL',
                    name: 'Season 1',
                    startDate: new Date(2019, 10, 30).toISOString(),
                    endDate: new Date(2019, 11, 30).toISOString(),
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
        const { IsSeasonIdExistsConstraint } = require('../../decorators/isSeasonIdExists')
        const isSeasonIdExists = await IsSeasonIdExistsConstraint.prototype.validate('AAqVvYGHKX4ayl97qrfy')
        expect(isSeasonIdExists).toBe(true)
    })
    it('returns false if seaon does not exist', async () => {
        const { IsSeasonIdExistsConstraint } = require('../../decorators/isSeasonIdExists')
        const isSeasonIdExists = await IsSeasonIdExistsConstraint.prototype.validate('123456')
        expect(isSeasonIdExists).toBe(false)
    })
})
