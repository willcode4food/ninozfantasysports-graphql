import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from 'type-graphql'
import { User, UserRepository } from '../entites/Users'
import { UserInput } from './types/user-input'
@Resolver((_of) => User)
export class UserResolver {
    @Query((_returns) => User, { nullable: false })
    async returnSingleUser(@Arg('id') id: string) {
        return await UserRepository.findById(id)
    }

    @Query(() => [User])
    async returnAllUsers() {
        return await UserRepository.find()
    }

    @Mutation(() => User)
    async createUser(
        @Arg('data') { username, email, firstName, lastName, profileImageName, city, state, zip }: UserInput
    ): Promise<User> {
        const entity = new User()
        entity.email = email
        entity.username = username
        entity.firstName = firstName
        entity.lastName = lastName
        entity.profileImageName = profileImageName
        entity.city = city
        entity.state = state
        entity.zip = zip
        const user = await UserRepository.create(entity)
        return user
    }
    @Mutation(() => User)
    async updateUser(
        @Arg('data') { id, username, email, firstName, lastName, profileImageName, city, state, zip }: UserInput
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
            console.log('UserResolver -> @Arg -> userToUpdate', userToUpdate)
            user = await UserRepository.update(userToUpdate)
            return user
        } catch (e) {
            console.log(e.message)
        }
        return user
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg('id') id: string) {
        await UserRepository.delete(id)
        return true
    }
}
