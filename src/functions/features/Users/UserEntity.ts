import { Collection, getRepository } from 'fireorm'
import { Field, ID, Int, ObjectType } from 'type-graphql'

export const returnId = () => ID
export const returnInt = () => Int

@Collection('users')
@ObjectType({ description: 'The Users model' })
export class User {
    // istanbul ignore next
    @Field(returnId)
    id: string

    @Field()
    dateCreated: Date

    @Field()
    dateUpdated: Date

    // istanbul ignore next
    @Field(returnInt)
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

export const UserEntityRepository = getRepository(User)
