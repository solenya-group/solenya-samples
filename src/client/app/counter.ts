import { Component, div, button } from 'pickle-ts'

export class Counter extends Component
{
    count: number = 0

    view () {
        return div (
            button ({ onclick : () => this.add(+1)}, "+"),
            this.count,
            button ({ onclick : () => this.add(-1)}, "-")     
        )
    }
    
    add (x: number) {
        return this.update (() => this.count += x)
    } 
}