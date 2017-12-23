import { Component, div } from 'pickle-ts'
import { myButton } from '../util/util'

export class Counter extends Component
{
    count: number = 0

    view () {
        return div (
            myButton (() => this.add(-1), "-"),
            this.count,
            myButton (() => this.add(+1), "+") 
        )
    }
    
    add (x: number) {
        return this.update (() => this.count += x)
    } 
}