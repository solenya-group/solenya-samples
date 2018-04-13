import { Component, div, ul, li, inputer, commandButton, commandLink } from 'pickle-ts'
import { icon, myButton, myInput } from '../util/util'
import { Exclude } from 'class-transformer'

export class Todos extends Component
{    
    title?: string
    list: string[] = []

    add () {
        this.update(() => {            
            this.list = this.list.concat (this.title!)            
            this.title = undefined
        })  
    }
    
    delete (task: string) {
        this.update (() =>
            this.list = this.list.filter (t => t != task)
        )        
    }

    view () {
        return div (
            div({class: "input-group"}, 
                myInput (() => this.title, e => this.updateProperty (e)),
                ! this.title ? undefined : myButton (() => this.add(), 'Add')
            ),
            ul (
                this.list.map (task =>
                    li (task, commandLink (() => this.delete (task), icon("delete")))
                )
            )
        )
    }
}