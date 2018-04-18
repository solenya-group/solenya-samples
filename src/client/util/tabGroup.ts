import { Component, div, ul, li, commandLink, VElement } from 'pickle-ts'
import { Cursor } from './cursor'
import { slide, slideChildren } from '../util/animations'

export abstract class TabGroup extends Cursor
{
    view() {
        return (
            div (
                ul ({ class:'nav nav-tabs'}, this.childKeys().map (k =>
                    li ({class: 'nav-item nav-link' + (this.currentName() == k ? ' active' : '') },
                        commandLink (() => this.updateIndex(this.index (k)), k)
                    )
                )),
                div ({ class: 'tab-content' },
                    this.childKeys().map (k =>
                        div ({ class: 'tab-pane' + (this.currentName() == k ? ' show active' : '') },
                            div (slide (true, this.prevIndex < this.activeIndex), div ( {key:this.currentName()}, this.childView (k)))
                        )
                    )
                )
            )
        )
    }

    abstract childView (name: string) : VElement
}

export class ComponentTabGroup extends TabGroup
{  
    childView (name: string) {
        return this[name].view()
    }

    childKeys() {        
        return Object.keys (this).filter (k => this[k] instanceof Component && k != "parent")
    }
}