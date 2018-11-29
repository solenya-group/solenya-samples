import { button, div, HValue, i, Let, inputText, inputValue, label, span, inputNumber, InputProps, combineObjAttrs } from 'pickle-ts'

export const icon = (...values: HValue[]) =>
    i({class: "material-icons"}, ...values, name)

export const myButton = (...values: HValue[]) =>
    button ({ class: "m-2 btn btn-outline-primary"}, ...values)

export const myInputText = (props: InputProps<string|undefined>) =>
    inputText (combineObjAttrs (props, { attrs: { class: "form-control" } }))

export const myInputNumber = (props: InputProps<number|undefined>) =>
    inputNumber (combineObjAttrs (props, {attrs: { class: "form-control"} }))

export const box = (...values: HValue[]) =>
    div ({style: { maxWidth: "500px" } }, ...values)

export const inputCurrency = (props: InputProps<number|undefined>) =>
    inputValue ({                
        inputStringToModel: currencyInputStringToNumber,
        modelToInputString: numberToCurrencyInputString,
        ...combineObjAttrs (props, { attrs: { class: "form-control"} })
    })    

export const currencyInputStringToNumber = (s: string, prevValue: number|undefined) => 
    parseFloat (s.replace(/\D/g,''))
    
export const numberToCurrencyInputString = (n: number|undefined, prevInputString: string) =>
     n == null || isNaN (n) ? "" : "$" + n.toLocaleString()

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

export const closeButton = (...values: HValue[]) =>
    button ({
        class: 'close d-inline-flex', type: 'button' 
    },
        ...values,
        icon ({ style: { fontSize: "16px", fontWeight: "bold" } }, "close")
    )

export const mapPropertyFromTo = <T> (
    array: T[],
    from: (value: T) => string,
    to: (value: T) => string
) =>
    (value: string) =>
        Let (array.find (c => from(c) == value), c => c ? to(c) : "")
