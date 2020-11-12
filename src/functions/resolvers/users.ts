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
    async createUser(@Arg('data') { username, email }: UserInput): Promise<User> {
        const entity = new User()
        entity.email = email
        entity.username = username
        const user = await UserRepository.create(entity)
        return user
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg('id') id: string) {
        await UserRepository.delete(id)
        return true
    }
}
