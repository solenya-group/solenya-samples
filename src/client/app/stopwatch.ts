import { Component, div } from 'pickle-ts'
import { myButton } from '../util/util'

export class Stopwatch extends Component
{
    on = false
    count = 0

    toggle() {
        this.on = ! this.on
        if (this.on)
            this.tick()
    }

    view () {
        return div (
            myButton (() => this.toggle(), this.on ? "stop": "start"),
            div ({ class: 'display-2' }, this.count/10)
        )
    }
    
    tick () {
        if (this.on)
            setTimeout(() => {            
                this.update(() => this.count++)
                this.tick()
            }, 100)
    } 
}