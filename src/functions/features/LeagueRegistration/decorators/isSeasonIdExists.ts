import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { SeasonRepository } from '../../Seasons/SeasonEntity'

@ValidatorConstraint({ async: true })
export class IsSeasonIdExistsConstraint implements ValidatorConstraintInterface {
    validate(seasonId: string) {
        return SeasonRepository.findById(seasonId).then((season) => {
            if (season) {
                return true
            }
            return false
        })
    }
}

// istanbul ignore next
export default function IsSeasonIdExists(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsSeasonIdExistsConstraint,
        })
    }
}
