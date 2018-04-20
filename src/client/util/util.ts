import { i, commandButton, inputer, KeyValue, HValue } from 'pickle-ts'

export function icon (name: string, ...properties: HValue[]) {
    return i({class: "material-icons"}, ...properties, name)
}

export function myButton (onclick: () => void, ...values: HValue[]) {
    return commandButton(onclick, {class: "m-2 btn btn-outline-primary"}, ...values)
}

export function myInput (prop: () => any, inputAction: (propertyChange: KeyValue, ... values: HValue[]) => any) {
    return inputer(prop, inputAction, {class: "form-control m-2"})
}