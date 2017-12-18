import { Component, div, button, ul, li, a, css, h2, main, br, h1, i } from 'pickle-ts'
import { Type } from 'class-transformer'

// todo: add similar version of this function to core pickle library
export function commandLink(action: () => void, ...values: any[]) {
    return a({href:"javascript:;", onclick: action}, ...values)
}

export function icon(name:string) {
    return i(css ("material-icons"), name)
}