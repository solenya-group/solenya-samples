import { Component, div, ul, li, inputer, commandButton } from 'pickle-ts'

export class Todos extends Component
{    
    title: string = ""
    list: string[] = []

    add () {
        this.update(() => {            
            this.list = this.list.concat (this.title)
            this.title = ""
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
            commandButton (() => this.add(), 'Add'),
            ul (
                this.list.map (task =>
                    li (
                        task,
                        commandButton (() => this.delete (task), "delete")
                    )
                )
            )
        )
    }
}