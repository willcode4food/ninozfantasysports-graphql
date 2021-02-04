import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import { User, UserRepository } from '../entities/User'
import { UserInput, UserUpdateInput } from './types'

export const resolveUser = () => User
@Resolver(resolveUser)
export class UserResolver {
    @Query((_returns) => User, { nullable: false })
    async returnSingleUser(@Arg('id') id: string): Promise<User> {
        return await UserRepository.findById(id)
    }

    @Query(() => [User])
    async returnAllUsers(): Promise<User[]> {
        return await UserRepository.find()
    }

    async isDuplicateUsernameForLoggedInUser(id: string, username: string): Promise<Boolean> {
        const possibleDupUsernames = await UserRepository.whereEqualTo('username', username).find()
        return possibleDupUsernames.filter((possibleDup: User) => possibleDup.id !== id).length > 0
    }

    async isDuplicateEmailForLoggedInUser(@Arg('id') id: string, @Arg('email') email: string): Promise<Boolean> {
        const possibleDupUsernames = await UserRepository.whereEqualTo('email', email).find()
        return possibleDupUsernames.filter((possibleDup: User) => possibleDup.id !== id).length > 0
    }
    @Mutation(() => User)
    async createUser(
        @Arg('data', { validate: true })
        {
            id,
            username,
            email,
            firstName,
            lastName,
            profileImageName,
            loginProvider,
            defaultAvatarThemeIndex,
            city,
            state,
            zip,
        }: UserInput
    ): Promise<User> {
        const entity = new User()
        entity.id = id
        entity.email = email
        entity.username = username
        entity.firstName = firstName
        entity.lastName = lastName
        entity.profileImageName = profileImageName
        entity.loginProvider = loginProvider
        entity.defaultAvatarThemeIndex = defaultAvatarThemeIndex
        entity.city = city
        entity.state = state
        entity.zip = zip
        entity.dateCreated = new Date()
        entity.dateUpdated = new Date()
        const user = await UserRepository.create(entity)
        return user
    }

    @Mutation(() => User)
    async updateUser(
        @Arg('data', { validate: true })
        { id, email, firstName, lastName, profileImageName, city, state, username, zip }: UserUpdateInput
    ): Promise<User> {
        let user: User = {
            id: '',
            email: '',
            username: '',
            firstName: '',
            lastName: '',
            profileImageName: '',
            city: '',
            state: '',
            zip: '',
            dateCreated: new Date(),
            dateUpdated: new Date(),
            defaultAvatarThemeIndex: 0,
            loginProvider: 'email',
        }

        try {
            const userToUpdate = await UserRepository.findById(id)
            if (!userToUpdate) {
                throw new Error('UserId is invalid')
            }
            const isDuplicateUsername: Boolean = await this.isDuplicateUsernameForLoggedInUser(id, username)
            if (isDuplicateUsername) {
                throw new Error('This Username already exists')
            }
            const isDuplicateEmail: Boolean = await this.isDuplicateEmailForLoggedInUser(id, email)
            if (isDuplicateEmail) {
                throw new Error('The email provided is being used by another user')
            }
            userToUpdate.email = email
            userToUpdate.firstName = firstName
            userToUpdate.lastName = lastName
            userToUpdate.profileImageName = profileImageName || userToUpdate.profileImageName || ''
            userToUpdate.username = username
            userToUpdate.city = city || userToUpdate.city || ''
            userToUpdate.state = state || userToUpdate.state || ''
            userToUpdate.zip = zip || userToUpdate.zip || ''
            userToUpdate.dateUpdated = new Date()
            user = await UserRepository.update(userToUpdate)
            return user
        } catch (e) {
            console.log(e.message)
            throw new Error(e.message)
        }
    }

    @Mutation(() => Boolean)
    async removeSingleUser(@Arg('id') id: string): Promise<boolean> {
        try {
            await UserRepository.delete(id)
            return true
        } catch (e) {
            throw new Error(e.message)
        }
    }
}
