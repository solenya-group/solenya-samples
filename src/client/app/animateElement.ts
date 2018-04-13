import { Component, div, radioGroup } from 'pickle-ts'
import { myButton } from '../util/util'
import { slide, slideChildren } from '../util/animations'
import { style } from 'typestyle/lib'

enum Direction { Horizontal = "Horizontal", Vertical = "Vertical" }

export class AnimateElement extends Component
{
    count = 0
    forwards = true
    option = Direction.Horizontal

    view () {           
        return div (
            radioGroup (() => this.option, [Direction.Vertical, Direction.Horizontal].map (d => [d, d]), e => this.updateProperty (e)),
            myButton (() => this.add(-1), "prev"),
            myButton (() => this.add(+1), "next"),
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
    backgroundImage: `url('/dist//pickle.png')`,
    backgroundSize: 'cover',
    position: 'absolute',
    backgroundColor: isEven ? "red" : "purple"
})