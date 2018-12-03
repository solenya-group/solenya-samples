import { Component, div } from 'solenya'
import { myButton } from '../util/util'

export class Counter extends Component
{
    count = 0

    view () {        
        return div (
            myButton ({ onclick: () => this.add(-1) }, "-"),
            this.count,
            myButton ({ onclick: () => this.add(+1) }, "+") 
        )
    }
    
    add (x: number) {
        this.update (() => this.count += x)
    } 
}