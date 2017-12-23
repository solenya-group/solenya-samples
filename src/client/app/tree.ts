import { Component, div, VNode } from 'pickle-ts'
import { Type } from 'class-transformer'
import { myButton } from '../util/util'

export class Tree extends Component
{    
    @Type (() => Tree) trees: Tree[] = []

    view () : VNode<any> {
        return div({ style : `padding-left:${this.branch().length*8}px`},
            "Component",
            myButton (() => this.inc(), "+"),
            this.trees.length == 0 ? undefined : myButton (() => this.dec(), "-"),
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