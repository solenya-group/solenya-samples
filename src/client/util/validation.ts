import { ValidationArguments, ValidationError } from 'class-validator'
import { style } from 'typestyle'
import { Component, InputProps, div, form, IValidated, label, VElement, getFriendlyName, getPropertyKey, PropertyRef } from 'solenya'

export const bestLabel = (args: ValidationArguments) =>
    getFriendlyName (args.object, args.property)

export function firstContraintViolation (error?: ValidationError)
{
    if (! error)
        return undefined

    var constraintKey = Object.keys(error.constraints)[0]
    return error.constraints[constraintKey]
}

export const validationMessage = (errorMessage?: string) => 
    ! errorMessage ? undefined :
    div ({ class: customInvalidFeedbackClass}, errorMessage)

export const propertyValidation = <T>(vform: Component & IValidated, prop: PropertyRef<T>) =>
    validationMessage (firstContraintViolation (vform.validator.validationError (prop)))

export const validationCss = (vform: IValidated, errorMessage?: string) =>
     'form-control' + (
        errorMessage ? ' is-invalid' :
        vform.validator.wasValidated ? ' is-valid' :
        '')

export function validationForm (vform: IValidated, ...values: any[]) {
    return (
        div (
            form ( { novalidate: "novalidate"},
                ...values
            )
        )
    )
}

export const feedbackMessageObj = {
    width: '100%',
    marginTop: '.25rem',
    fontSize: '80%'
}

export const customInvalidFeedbackClass = style({
    $debugName: 'customInvalidFeedback',
    color: 'red'
}, feedbackMessageObj)

export const inputUnit = <T>
(
    target: IValidated & Component,
    prop: PropertyRef<T>,           
    createInput: (props: InputProps<T>) => VElement
) =>
{
    const id = getPropertyKey (prop)

    return div ({ class: 'form-group'},
         label ({ for: id}, getFriendlyName (target, prop) ),
         createInput ({target, prop, attrs: { id: id } }),
         propertyValidation (target, prop)
    )
}