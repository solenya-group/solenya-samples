﻿import { i, commandButton, inputer, KeyValue } from 'pickle-ts'

export function icon(name:string) {
    return i({class: "material-icons"}, name)
}

export function myButton (onclick: () => void, ...values: any[]) {
    return commandButton(onclick, {class: "m-2 btn btn-outline-primary"}, ...values)
}

export function myInput (prop: () => any, inputAction: (propertyChange: KeyValue) => any) {
    return inputer(prop, inputAction, {class: "form-control m-2"})
}