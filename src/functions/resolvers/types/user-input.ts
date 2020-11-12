import { InputType, Field, ID } from 'type-graphql'
import { Length, IsEmail } from 'class-validator'
import { User } from '../../entites/Users'

@InputType()
export class UserInput implements Partial<User> {
    @Field()
    dateCreated: string
    @Field()
    defaultAvatarThemeIndex: number
    @Field()
    @IsEmail()
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
    @Length(1, 255)
    username: string
    constructor() {
        this.dateCreated = ''
        this.defaultAvatarThemeIndex = 0
        this.email = ''
        this.firstName = ''
        this.lastName = ''
        this.loginProvider = ''
        this.profileImageName = ''
        this.username = ''
    }
}
