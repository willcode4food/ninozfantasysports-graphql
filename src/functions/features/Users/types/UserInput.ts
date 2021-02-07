import { IsEmail, IsIn, IsNotEmpty, Length } from 'class-validator'
import { Field, ID, InputType, Int } from 'type-graphql'
import IsNotEmailAlreadyExistsDecorator from '../decorators/IsNotEmailAlreadyExistsDecorator'
import IsNotUsernameAlreadyExistsDecorator from '../decorators/IsNotUsernameAlreadyExistsDecorator'
import { User } from '../UserEntity'
@InputType()
export default class UserInput implements Partial<User> {
    @Field(() => ID)
    id: string

    @Field(() => Int)
    @IsIn([0, 1, 2, 3])
    defaultAvatarThemeIndex: number

    @Field({ nullable: false })
    @IsNotEmpty()
    @IsEmail()
    @IsNotEmailAlreadyExistsDecorator({ message: 'A user with that email address has already registered.' })
    email: string

    @Field({ nullable: false })
    @Length(2, 20)
    firstName: string

    @Field({ nullable: false })
    @Length(2, 20)
    lastName: string

    @Field({ nullable: false })
    @IsNotEmpty()
    @IsIn(['email', 'google'])
    loginProvider: string

    @Field({ nullable: true })
    profileImageName: string

    @Field({ nullable: false })
    @Length(2, 255)
    @IsNotUsernameAlreadyExistsDecorator({ message: 'Sorry, the username, $value has been taken.' })
    username: string

    @Field({ nullable: true })
    city: string

    @Field({ nullable: true })
    state: string

    @Field({ nullable: true })
    zip: string
}
