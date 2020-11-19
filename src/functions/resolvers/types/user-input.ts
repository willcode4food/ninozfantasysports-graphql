import { InputType, Field, ID } from 'type-graphql'
import { Length, IsEmail } from 'class-validator'
import { User } from '../../entites/Users'

@InputType()
export class UserInput implements Partial<User> {
    @Field()
    id: string
    @Field()
    dateCreated: Date
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
