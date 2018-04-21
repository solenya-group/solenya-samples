import { i, commandButton, inputText, KeyValue, HValue } from 'pickle-ts'

export function icon (name: string, ...properties: HValue[]) {
    return i({class: "material-icons"}, ...properties, name)
}

export function myButton (onclick: () => void, ...values: HValue[]) {
    return commandButton(onclick, {class: "m-2 btn btn-outline-primary"}, ...values)
}

export function myInput (prop: () => any, inputAction: (propertyChange: KeyValue) => any, ...values: HValue[]) {
    return inputText(prop, inputAction, {class: "form-control m-2"}, ...values)
}