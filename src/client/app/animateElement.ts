import { style } from 'typestyle/lib'
import { Component, div, radioGroup, VElement } from 'solenya'
import { slide } from '../util/animations'
import { myButton } from '../util/util'

enum Direction { Horizontal = "Horizontal", Vertical = "Vertical" }

export class AnimateElement extends Component
{
    count = 0
    forwards = true
    option = Direction.Horizontal

    view () : VElement {           
        return div (
            radioGroup ({
                target: this,
                prop: () => this.option,
                options: [Direction.Vertical, Direction.Horizontal]
                    .map (d => ({label: ""+d, value: d}))
            }),
            myButton ({ onclick: () => this.add(-1) }, "prev"),
            myButton ({ onclick: () => this.add(+1) }, "next"),
            div (slide (this.option == "Horizontal", this.forwards),
                div (
                    { key: this.count, class: sprite (this.count % 2 == 0) },
                )
            )
        )
    }

    add(x: number) {
        this.update(() => {
            this.count += x
            this.forwards = x > 0
        })
    }
}

const sprite = (isEven: boolean) => style ({
    padding: '75px',
    backgroundImage: `url('/client/images/pickle.png')`,
    backgroundSize: 'cover',
    position: 'absolute',
    backgroundColor: isEven ? "red" : "purple"
})