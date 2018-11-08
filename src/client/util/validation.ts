import { ValidationError } from 'class-validator'
import { style } from 'typestyle'
import { Component, HValue, VElement, div, key, form, label, KeyValue, IValidated } from 'pickle-ts'

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

export const propertyValidation = (vform: Component & IValidated, prop: () => any) =>
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

export type InputFn = (
    propertyAccess: () => any,
    inputAction: (propertyChange: KeyValue) => any,
    ...values: HValue[]
) => VElement

export function superInput (inputFn: InputFn, component: IValidated & Component, prop: () => any, labelStr: string, ...values: HValue[])
{
    return div ({class: 'form-group'},
         label ({for: key (prop)}, labelStr),
         inputFn (prop, e => component.updateProperty (e), { id: key (prop)}, ...values),          
         propertyValidation (component, prop)
    )
}

export function Label (s: string) {
    return Reflect.metadata("label", s);
}

export function getLabel (target: any, propertyKey: string) {
    return Reflect.getMetadata("label", target, propertyKey) as string|undefined
}