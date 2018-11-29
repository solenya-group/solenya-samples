import { IsNotEmpty, IsNumber, Max, Min, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator"
import { getFriendlyName } from "pickle-ts"

const bestLabel = (args: ValidationArguments) =>
    getFriendlyName (args.object, args.property)

const emptyValidMsg = {
    message: (args: ValidationArguments) => bestLabel (args) + " must be chosen"
}

export const vIsNotEmpty = () => IsNotEmpty (emptyValidMsg)

export const vIsNumber = () => IsNumber ({}, emptyValidMsg)

export const vMin = (min: number) => Min (min, {
    message: (args: ValidationArguments) => bestLabel (args) + " must be at least $constraint1"
})

export const vMax = (max: number) => Max (max, {
    message: (args: ValidationArguments) => bestLabel (args) + ` must be at most ${max}`
})

export const vLengthRange = (min: number, max:number) => 
    Validate (LengthRangeValidatorConstraint, [min, max])

@ValidatorConstraint({ name: "lengthRange", async: false })
class LengthRangeValidatorConstraint implements ValidatorConstraintInterface {

    validate (text: string, args: ValidationArguments) {
        return text != null && text.length >= args.constraints[0] && text.length <= args.constraints[1]
    }

    defaultMessage(args: ValidationArguments) {
        return `${bestLabel (args)} must be between ${args.constraints[0]} and ${args.constraints[1]} characters in length`
    }
}