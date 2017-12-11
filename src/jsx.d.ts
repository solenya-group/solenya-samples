import { VNode } from 'pickle-ts'

declare global {    
    namespace JSX {
        interface Element<Data> extends VNode<Data> { }
        interface IntrinsicElements {
            [elemName: string]: any
        }
    }
}