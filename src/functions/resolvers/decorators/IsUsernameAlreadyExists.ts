import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { UserRepository } from '../../entites/User'

@ValidatorConstraint({ async: true })
export class IsUsernameAlreadyExistsConstraint implements ValidatorConstraintInterface {
    validate(username: string) {
        return UserRepository.whereEqualTo('username', username)
            .findOne()
            .then((user) => {
                if (user) return true
                return false
            })
    }
}

// istanbul ignore next
export function IsUsernameAlreadyExists(validationOptions?: ValidationOptions) {
    // istanbul ignore next
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUsernameAlreadyExistsConstraint,
        })
    }
}
