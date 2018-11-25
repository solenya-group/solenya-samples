import { ValidationArguments, ValidationError } from 'class-validator'
import { style } from 'typestyle'
import { Component, div, form, HValue, IValidated, label, VElement, getFriendlyName, getPropertyKey, InputProps, PropertyRef } from 'pickle-ts'

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

export type InputFn<T> = (
    component: Component,
    prop: PropertyRef<T>,
    inputProps: InputProps,
    ...values: HValue[]
) => VElement

export interface SuperInputProps extends InputProps {
    label?: HValue
}

export function superInput<T> (
    component: IValidated & Component,
    inputFn: InputFn<T>,    
    prop: PropertyRef<T>,   
    props: SuperInputProps,
    ...values: HValue[]
)
{
    return div ({ class: 'form-group'},
         label ({ for: getPropertyKey (prop)}, props.label || getFriendlyName (component, prop)),
         inputFn (component, prop, props, { id: getPropertyKey (prop)}, ...values),          
         propertyValidation (component, prop)
    )
}