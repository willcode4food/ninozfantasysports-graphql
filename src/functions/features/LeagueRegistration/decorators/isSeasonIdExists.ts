import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { SeasonRepository } from '../../Seasons/SeasonEntity'

@ValidatorConstraint({ async: true })
export class IsSeasonsIdExistsConstraint implements ValidatorConstraintInterface {
    validate(userId: string) {
        return SeasonRepository.findById(userId).then((user) => {
            if (user) {
                return true
            }
            return false
        })
    }
}

// istanbul ignore next
export default function IsSeasonsIdExists(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsSeasonsIdExistsConstraint,
        })
    }
}
