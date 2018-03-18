import { VElement } from 'pickle-ts'

declare global {    
    namespace JSX {
        interface Element<Data> extends VElement { }
        interface IntrinsicElements {
            [elemName: string]: any
        }
    }
}