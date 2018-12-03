import { Exclude } from 'class-transformer'
import { range, shuffle } from 'lodash'
import { Component, div } from 'solenya'
import { slideChildren } from '../util/animations'
import { myButton } from '../util/util'

export class AnimateList extends Component {
    @Exclude() items = shuffle (range(1, 101))

    view() {
        return div(
            myButton ({onclick: () => this.sort() }, "shuffle"),
            div (slideChildren(), this.items.map(n => div ({ key: n, style: { display: "inline-block", width: "40px" } }, n)))
        )
    }

    sort() {
        this.update (() => this.items = shuffle (this.items))
    }
}