import { range, shuffle } from 'lodash'
import { transient, Component, div } from 'solenya'
import { transitionChildren } from 'solenya-animation'
import { myButton } from '../util/util'

export class AnimateList extends Component {
    @transient items = shuffle (range(1, 101))

    view() {
        return div(
            myButton ({onclick: () => this.sort() }, "shuffle"),
            div (transitionChildren(), this.items.map(n => div ({ key: n, style: { display: "inline-block", width: "40px" } }, n)))
        )
    }

    sort() {
        this.update (() => this.items = shuffle (this.items))
    }
}