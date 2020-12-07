import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import { User, UserRepository } from '../entites/User'
import { UserInput } from './types'
@Resolver((_of) => User)
export class UserResolver {
    @Query((_returns) => User, { nullable: false })
    async returnSingleUser(@Arg('id') id: string): Promise<User> {
        return await UserRepository.findById(id)
    }

    @Query(() => [User])
    async returnAllUsers(): Promise<User[]> {
        return await UserRepository.find()
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
        { id, username, email, firstName, lastName, profileImageName, city, state, zip }: UserInput
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
            userToUpdate.email = email || userToUpdate.email
            userToUpdate.username = username || userToUpdate.username
            userToUpdate.firstName = firstName || userToUpdate.firstName
            userToUpdate.lastName = lastName || userToUpdate.lastName
            userToUpdate.profileImageName = profileImageName || userToUpdate.profileImageName
            userToUpdate.city = city || userToUpdate.city
            userToUpdate.state = state || userToUpdate.state
            userToUpdate.zip = zip || userToUpdate.zip
            userToUpdate.dateUpdated = new Date()
            user = await UserRepository.update(userToUpdate)
            return user
        } catch (e) {
            console.log(e.message)
        }
        return user
    }

    @Mutation(() => Boolean)
    async removeSingleUser(@Arg('id') id: string): Promise<boolean> {
        try {
            await UserRepository.delete(id)
        } catch (e) {
            console.log(e.message)
            return false
        }
        return true
    }
}
