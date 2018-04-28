import { i, commandButton, inputText, KeyValue, HValue, inputValue } from 'pickle-ts'

export function icon (name: string, ...properties: HValue[]) {
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