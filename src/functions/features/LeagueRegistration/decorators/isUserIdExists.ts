import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { UserEntityRepository } from '../../Users/UserEntity'

@ValidatorConstraint({ async: true })
export class IsUserIdExistsConstraint implements ValidatorConstraintInterface {
    validate(userId: string) {
        return UserEntityRepository.findById(userId).then((user) => {
            if (user) {
                return true
            }
            return false
        })
    }
}

// istanbul ignore next
export default function IsUserIdExists(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserIdExistsConstraint,
        })
    }
}
