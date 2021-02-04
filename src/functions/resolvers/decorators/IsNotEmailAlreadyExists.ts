import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { UserRepository } from '../../entities/User'

@ValidatorConstraint({ async: true })
export class IsNotEmailAlreadyExistsConstraint implements ValidatorConstraintInterface {
    validate(email: string) {
        return UserRepository.whereEqualTo('email', email)
            .findOne()
            .then((user) => {
                if (user) return false
                return true
            })
    }
}
// istanbul ignore next
export function IsNotEmailAlreadyExists(validationOptions?: ValidationOptions) {
    // istanbul ignore next
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNotEmailAlreadyExistsConstraint,
        })
    }
}
