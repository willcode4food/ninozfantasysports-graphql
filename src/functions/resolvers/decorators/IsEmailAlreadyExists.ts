import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { UserRepository } from '../../entites/User'

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistsConstraint implements ValidatorConstraintInterface {
    validate(email: string) {
        return UserRepository.whereEqualTo('email', email)
            .findOne()
            .then((user) => {
                if (user) return false
                return true
            })
    }
}

export function IsEmailAlreadyExists(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAlreadyExistsConstraint,
        })
    }
}
