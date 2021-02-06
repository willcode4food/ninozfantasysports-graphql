import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { UserEntityRepository } from '../UserEntity'

@ValidatorConstraint({ async: true })
export class IsNotUsernameAlreadyExistsConstraint implements ValidatorConstraintInterface {
    validate(username: string) {
        return UserEntityRepository.whereEqualTo('username', username)
            .findOne()
            .then((user) => {
                if (user) return false
                return true
            })
    }
}

// istanbul ignore next
export default function IsNotUsernameAlreadyExistsDecorator(validationOptions?: ValidationOptions) {
    // istanbul ignore next
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNotUsernameAlreadyExistsConstraint,
        })
    }
}
