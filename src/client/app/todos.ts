import { Component, div, ul, li, inputer, commandButton, css, p } from 'pickle-ts'
import { icon, commandLink } from '../util/util'

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
            inputer (() => this.title, e => this.updateProperty (e)),
            p (! this.title ? undefined : commandButton (() => this.add(), 'Add')),
            ul (
                this.list.map (task =>
                    li (                                                
                        task,
                        commandLink (() => this.delete (task), icon("delete"))
                    )
                )
            )
        )
    }
}