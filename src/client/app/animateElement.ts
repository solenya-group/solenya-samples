import { Component, div } from 'pickle-ts'
import { myButton } from '../util/util'
import { slideInOut } from '../util/animations'

export class AnimateElement extends Component
{
    on = false

    view () {        
        return div(
            myButton(() => this.toggle(), "toggle"),
            ! this.on ? null : slideInOut (div ({ class: "sprite"}))
        )
    }

    toggle() {
        this.update (() => this.on = ! this.on)
    }
}
