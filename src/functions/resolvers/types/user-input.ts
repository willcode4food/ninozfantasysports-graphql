import { InputType, Field, ID } from 'type-graphql'
import { Length, IsEmail, IsDate, IsNotEmpty, IsNumber, IsIn } from 'class-validator'
import { User } from '../../entites/Users'

@InputType()
export class UserInput implements Partial<User> {
    @Field()
    id: string
    @Field()
    @IsDate()
    dateCreated: Date
    @Field()
    @IsDate()
    dateUpdated: Date
    @Field()
    @IsIn([0, 1, 2, 3])
    defaultAvatarThemeIndex: number
    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string
    @Field()
    @Length(1, 20)
    firstName: string
    @Field()
    @Length(1, 20)
    lastName: string
    @Field()
    @IsNotEmpty()
    @IsIn(['email', 'google'])
    loginProvider: string
    @Field()
    profileImageName: string
    @Field()
    @Length(2, 255)
    @IsNotEmpty()
    username: string
    @Field()
    city: string
    @Field()
    state: string
    @Field()
    @IsNumber()
    zip: string

    constructor() {
        this.id = ''
        this.dateCreated = new Date()
        this.dateUpdated = new Date()
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
