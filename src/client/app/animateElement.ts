import { Component, div, radioGroup } from 'pickle-ts'
import { myButton } from '../util/util'
import { slide, slideChildren } from '../util/animations'

enum Direction { Horizontal = "Horizontal", Vertical = "Vertical" }

export class AnimateElement extends Component
{
    count = 0
    forwards = true
    option = Direction.Horizontal

    view () {           
        return div(
            radioGroup (() => this.option, [Direction.Vertical, Direction.Horizontal].map (d => [d, d]), e => this.updateProperty (e)),
            myButton(() => this.add(-1), "prev"),
            myButton(() => this.add(+1), "next"),
            slide (
                block (this.count), this.option == "Horizontal", this.forwards
            ),
        )
    }

    add(x: number) {
        this.update(() => {
            this.count += x
            this.forwards = x > 0
        })
    }
}

function block (key: number) {
    return div ({key: key, class:"sprite", style: "background-color:" + (key % 2 == 0 ? "red" : "purple")})
}
