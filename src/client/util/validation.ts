import { Component, key, div, small, HValue, VElement, label, KeyValue } from 'pickle-ts'
import { validateSync, ValidationError } from 'class-validator'
import { myInput } from './util'
import { Exclude } from 'class-transformer'

export abstract class MyForm extends Component implements IValidateComponent
{
    @Exclude() validationErrors: ValidationError[] = []
    @Exclude() validated = false
    
    updated() {
        if (this.validated)
            this.validationErrors = validateSync (this)
    }
}

export interface IValidateComponent
{
    validationErrors: ValidationError[]
    validated: boolean    
}

export function validateMessage (component: IValidateComponent, prop: () => any)
{
    if (! component.validated)
        return

    var errors = component.validationErrors
    var error = errors.find (e => e.property == key(prop))

    if (! error)
        return undefined

    var constraintKey = Object.keys(error.constraints)[0]
    var errorMessage = error.constraints[constraintKey]

    return div ({ style: {color: 'red'} }, errorMessage)
}

export type InputFn = (
    propertyAccess: () => any,
    inputAction: (propertyChange: KeyValue) => any,
    ...values: HValue[]
) => VElement

export function superInput (inputFn: InputFn, component: Component & IValidateComponent, prop: () => any, labelStr: string, ...values: HValue[])
{
    return div ({class: 'form-group'},
         label ({for: key (prop)}, labelStr),
         inputFn (prop, e => component.updateProperty (e), { id: key (prop)}, ...values),          
         small (validateMessage (component, prop))
    )
}