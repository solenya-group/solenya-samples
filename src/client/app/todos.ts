import { Component, div, ul, li, inputText , commandLink, span, input } from 'pickle-ts'
import { myInput, icon } from '../util/util'
import { style } from 'typestyle'
import { NestedCSSProperties } from 'typestyle/lib/types';

enum TaskType { active = "active", done = "done", all = "all" }

type TaskItem = { name: string, done: boolean}

export class Todos extends Component
{    
    list: TaskItem[] = []
    currentTaskType = TaskType.all
    title?: string

    addTask () {
        this.update(() => {            
            this.list = this.list.concat({name: this.title!, done: false})            
            this.title = undefined
        })  
    }
    
    toggleTaskStatus (item: TaskItem) {
        this.update(() => {
            item.done = ! item.done
        })        
    }

    removeTask (item: TaskItem) {
        this.update(() => {
            this.list = this.list.filter (i => i != item)
        })
    }

    updateListFilter (type: TaskType) {
        this.update(() => {
            this.currentTaskType = type
        })
    }

    clearCompleted() {
        this.update(() => {
            this.list = this.list.filter (i => ! i.done)
        })
    }

    filteredList() {
        return (
            this.currentTaskType == TaskType.all ? this.list :
            this.currentTaskType == TaskType.done ? this.list.filter (i => i.done) :
            this.list.filter (i => ! i.done)
        )
    }

    linksView() {
        return (
            div (
                [TaskType.all, TaskType.done, TaskType.active].map (t => 
                    commandLink(() => this.updateListFilter (t),                    
                        span({
                                class: 'px-1',
                                style: t != this.currentTaskType ? {} : { textDecoration : "underline" }
                            },
                            t
                        )
                    )),
                commandLink(() => this.clearCompleted(), {class: "ml-4"}, "clear completed")
            )
        )
    }

    inputView() {
        return (
            div ({ class: "input-group" }, 
                myInput (
                    () => this.title,
                    e => this.updateProperty (e),
                    {
                        class: placeholderClass,
                        placeholder: "What needs to be done?",
                        onkeyup: (e: any) => {
                            if (e.keyCode == 13)
                                this.addTask ()
                        }
                    }
                 )
            )
        )
    }

    listView() {
        return (
             ul (
                this.filteredList().map (task =>
                    li (                        
                        commandLink(() => this.removeTask(task), { class: hoverClass }, icon ("close")),
                        input ({
                            type: "checkbox",
                            value: task.done ? "checked" : undefined,
                            onclick: () => this.toggleTaskStatus (task)
                        }),
                        span ({class: "pl-1"},
                            ! task.done ? task.name : span ({ style: {textDecoration: 'line-through', color: "lightgray"}}, task.name)
                        )
                    )
                )
            )
        )
    }

    view () {
        return div (
            this.linksView(),
            this.inputView(),
            this.listView()
        )
    }
}

const hoverClass = style ({
    color: "transparent",
    $nest: {
        "&:hover": {
            color: "black"
        }
    }
})

const placeholderClass = style ({
    $nest: {
        "&::placeholder": {
            color: "lightgray"
        }
    }
})