import { IsEmail, IsNotEmpty, Length } from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'
import { User } from '../../entities/User'

@InputType()
export class UserUpdateInput implements Partial<User> {
    @Field(() => ID)
    id: string

    @Field({ nullable: false })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Field({ nullable: false })
    @Length(2, 20)
    firstName: string

    @Field({ nullable: false })
    @Length(2, 20)
    lastName: string

    @Field({ nullable: true })
    profileImageName: string

    @Field({ nullable: false })
    @Length(2, 255)
    username: string

    @Field({ nullable: true })
    city: string

    @Field({ nullable: true })
    state: string

    @Field({ nullable: true })
    zip: string
}
