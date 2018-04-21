import { Component, div, ul, li, inputText, commandLink, span, input } from 'pickle-ts'
import { myInput, icon } from '../util/util'
import { style } from 'typestyle'

enum TaskType { active = "active", done = "done", all = "all" }

type TaskItem = { name: string, done: boolean}

export class Todos extends Component
{    
    list: TaskItem[] = []
    currentTaskType = TaskType.all
    currentText?: string

    addTask () {
        this.update(() => {            
            this.list = this.list.concat({name: this.currentText!, done: false})            
            this.currentText = undefined
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
                    () => this.currentText,
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
                    li ({class: hoverArea }, 
                        commandLink(() => this.removeTask(task), { class: showOnHover }, icon ("close")),
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
            this.listView(),
            div ("To autosave the todo list to local storage, go to the console and type: window.app.storage.autosave = true")
        )
    }
}

const placeholderClass = style ({
    $nest: {
        "&::placeholder": {
            color: "lightgray"
        }
    }
})


export const showOnHover = style ({})

export const hoverArea = style (<any>{    
    $nest: {
        ['.'+showOnHover]: {
            color: "transparent"
        },
        "&:hover": {
          ['.'+showOnHover] : {
             color: "blue"
          }
        } 
      }  
})