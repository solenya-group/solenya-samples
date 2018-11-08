import { i, commandButton, inputText, KeyValue, HValue, inputValue, Component, Let } from 'pickle-ts'
import { Exclude } from "class-transformer"

export function icon (...properties: HValue[]) {
    return i({class: "material-icons"}, ...properties, name)
}

export function myButton (onclick: () => void, ...values: HValue[]) {
    return commandButton(onclick, {class: "m-2 btn btn-outline-primary"}, ...values)
}

export function myInput (prop: () => any, inputAction: (propertyChange: KeyValue) => any, ...values: HValue[]) {
    return inputText(prop, inputAction, {class: "form-control"}, ...values)
}

export function inputCurrency (propertyAccess: () => any, inputAction: (propertyChange: KeyValue) => any, ...values: any[])
{
    return inputValue<number> (
        propertyAccess,
        inputAction,
        currencyInputStringToNumber,
        numberToCurrencyInputString,
        {class: "form-control"},
        ...values
    )
}

export function currencyInputStringToNumber (s: string, prevValue: number) : number {
    return parseFloat (s.replace(/\D/g,''))
}
    
export function numberToCurrencyInputString (n: number, prevInputString: string) {
    return Number.isNaN (n) ? "" : "$" + n.toLocaleString()
}

export function transient <T extends Component> (parent: Component, field: string, create: () => T) : T {
    if (parent[field])
        return parent[field]

    var child = parent[field] = create()
    Exclude()(parent, field)
    child.attach (parent.app!, parent)    
    return child
}

export const mapPropertyFromTo = <T> (
    array: T[],
    from: (value: T) => string,
    to: (value: T) => string
    ) =>
    (value: string) =>
        Let (array.find (c => from(c) == value), c => c ? to(c) : "")
       
export function decamel (str: string) {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./g, str => str.toUpperCase() )
}