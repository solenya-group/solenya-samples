import { Component, div, commandButton, css } from 'pickle-ts'

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

function myButton (onclick: () => void, content: any) {
    return commandButton (onclick, content, css("m-2", "btn", "btn-outline-primary"))
}