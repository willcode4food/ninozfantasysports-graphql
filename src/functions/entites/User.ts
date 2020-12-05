import { getRepository, Collection } from 'fireorm'
import { ObjectType, Field, ID, Int } from 'type-graphql'

@Collection('users')
@ObjectType({ description: 'The Users model' })
export class User {
    @Field(() => ID)
    id: string

    @Field()
    dateCreated: Date

    @Field()
    dateUpdated: Date

    @Field(() => Int)
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
}

export const UserRepository = getRepository(User)
