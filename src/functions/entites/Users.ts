import { getRepository, Collection } from 'fireorm'
import { ObjectType, Field, ID } from 'type-graphql'

@Collection('users')
@ObjectType({ description: 'The Users model' })
export class User {
    @Field(() => ID)
    id: string
    @Field()
    dateCreated: Date
    @Field()
    defaultAvatarThemeIndex: number
    @Field()
    email: string
    @Field()
    firstName: string
    @Field()
    lastName: string
    @Field()
    loginProvider: string
    @Field()
    profileImageName: string
    @Field()
    username: string
    @Field()
    city: string
    @Field()
    state: string
    @Field()
    zip: string

    constructor() {
        this.id = ''
        this.dateCreated = new Date()
        this.defaultAvatarThemeIndex = 0
        this.email = ''
        this.firstName = ''
        this.lastName = ''
        this.loginProvider = ''
        this.profileImageName = ''
        this.username = ''
        this.city = ''
        this.state = ''
        this.zip = ''
    }
}

export const UserRepository = getRepository(User)
