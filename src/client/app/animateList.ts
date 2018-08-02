import { Component, div, ul, li } from 'pickle-ts'
import { myButton } from '../util/util'
import { Exclude } from 'class-transformer'
import { slideChildren } from '../util/animations'
import { range, shuffle } from 'lodash-es'

export class AnimateList extends Component {
    @Exclude() items = shuffle (range(1, 101))

    view() {
        return div(
            myButton(() => this.sort(), "shuffle"),
            div(slideChildren(), this.items.map(n =>
                div ({ key: n, style: { display: "inline-block", width: "40px" } }, n)))
        )
    }

    sort() {
        this.update (() => this.items = shuffle (this.items))
    }
}