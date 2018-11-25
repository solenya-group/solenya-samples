import { i, inputText, HValue, inputValue, div, label, span, Component, button, PropertyRef, InputProps, inputNumber } from 'pickle-ts'

export function icon (...values: HValue[]) {
    return i({class: "material-icons"}, ...values, name)
}

export function myButton (...values: HValue[]) {
    return button ({class: "m-2 btn btn-outline-primary"}, ...values)
}

export function myInputText (component: Component, prop: PropertyRef<string|undefined>, inputProps: InputProps, ...values: HValue[]) {
    return inputText (component, prop, inputProps, {class: "form-control"}, ...values)
}

export function myInputNumber (component: Component, prop: PropertyRef<number|undefined>, inputProps: InputProps, ...values: HValue[]) {
    return inputNumber (component, prop, inputProps, {class: "form-control"}, ...values)
}

export const box = (...values: HValue[]) =>
    div ({style: { maxWidth: "500px" } }, ...values)

export function inputCurrency (component: Component, prop: PropertyRef<number|undefined>, inputProps: InputProps, ...values: any[])
{
    return inputValue<number|undefined> (
        component,
        prop,
        {
            inputStringToModel: currencyInputStringToNumber,
            modelToInputString: numberToCurrencyInputString
        },
        {class: "form-control"},
        ...values
    )
}

export function currencyInputStringToNumber (s: string, prevValue: number|undefined) : number {
    return parseFloat (s.replace(/\D/g,''))
}
    
export function numberToCurrencyInputString (n: number|undefined, prevInputString: string) {
    return n == null || isNaN (n) ? "" : "$" + n.toLocaleString()
}

export function urlQuery (url: string, obj: object) {
    const params = Object.keys (obj).map (k => k + "=" + encodeURIComponent (obj[k]))
    return url + "?" + params.join ("&")
}

export const labeledValue = (name: string, value: any) =>
  div (label (name, ": ", span (value)))

//https://stackoverflow.com/questions/43382569/generic-memoize-function-returning-the-same-function-type
export function memoize<R, T extends (...args: any[]) => R>(f: T): T {
    const memory = new Map<string, R>()
    const g = (...args: any[]) => {
        if (!memory.get(args.join()))
            memory.set(args.join(), f(...args))
        return memory.get(args.join())
    }
    return g as T
}

type CloseButtonProps = {
    adjustY: number
}
  
export function closeButton (props: CloseButtonProps, ...values: HValue[]) {
    return button ({
        class: 'close d-inline-flex', type: 'button' }, span ({class: 'ml-1',style: { fontSize: "17px",transform:`translateY(${props.adjustY || 0}px)`}}, "×") 
    )
}