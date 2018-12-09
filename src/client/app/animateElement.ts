import { Component, div, radioGroup, VElement } from 'solenya'
import { transitionChild, Orientation, Direction } from 'solenya-animation'
import { style } from 'typestyle/lib'
import { myButton } from '../util/util'

export class AnimateElement extends Component {
    count = 0  
    orientation: Orientation = "horizontal"
    direction: Direction = "forwards"
  
    view() {
        return div(
            radioGroup({
                target: this,
                prop: () => this.orientation,
                options: ["vertical", "horizontal"].map(d => ({ label: d, value: d})),
            }),
            myButton ({ onclick: () => this.add(-1) }, "prev"),
            myButton ({ onclick: () => this.add(+1) }, "next"),
            div(transitionChild({orientation: this.orientation, direction: this.direction}),
                div({ key: this.count, class: sprite(this.count % 2 == 0) })
            )
        )
    }
  
    add(x: number) {
        this.update(() => {
           this.count += x
          this.direction = x > 0 ? "forwards" : "backwards"
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