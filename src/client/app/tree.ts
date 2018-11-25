import { Component, div, VElement } from 'pickle-ts'
import { Type } from 'class-transformer'
import { myButton } from '../util/util'

export class Tree extends Component
{    
    @Type (() => Tree) trees: Tree[] = []
    
    view () : VElement {
        return div ({ style: { paddingLeft: "" + this.branch().length / 2 + "rem" } },
            "Component",
            myButton ({ onclick: () => this.inc() }, "+"),
            this.trees.length == 0 ? undefined : myButton ({ onclick: () => this.dec() }, "-"),
            this.trees.map (c => c.view ())
        )
    }
    
    inc () {
        return this.update(() => this.trees.push (new Tree ()))
    } 

    dec () {
        return this.update (() => this.trees.pop ())
    } 
}