import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { LeagueRepository } from '../../Leagues/LeagueEntity'

@ValidatorConstraint({ async: true })
export class IsLeagueIdExistsConstraint implements ValidatorConstraintInterface {
    validate(leagueId: string) {
        return LeagueRepository.findById(leagueId).then((league) => {
            if (league) {
                return true
            }
            return false
        })
    }
}

// istanbul ignore next
export default function IsLeagueIdExists(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsLeagueIdExistsConstraint,
        })
    }
}
