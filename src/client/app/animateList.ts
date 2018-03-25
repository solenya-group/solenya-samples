import { Component, div, ul, li } from 'pickle-ts'
import { myButton } from '../util/util'
import { Exclude } from 'class-transformer'
import { slideChildren } from '../util/animations'
import { range, shuffle } from 'lodash'

export class AnimateList extends Component
{
    @Exclude() items = range (1, 20)

    view () {        
        return div(
            myButton (() => this.shuffle (), "shuffle"),       
            slideChildren (ul (this.items.map (n => li ({ key: n }, n))))
        )
    }

    shuffle() {
        this.update (() => this.items = shuffle (this.items))
    }
}
