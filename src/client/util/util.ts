import { i, css, commandButton, inputer, KeyValue } from 'pickle-ts'

export function icon(name:string) {
    return i(css ("material-icons"), name)
}

export function myButton (onclick: () => void, content: any) {
    return commandButton (onclick, content, css("m-2", "btn", "btn-outline-primary"))
}

export function myInput (prop: () => any, inputAction: (propertyChange: KeyValue) => any) {
    return inputer (prop, inputAction, css("form-control", "m-2"))
}