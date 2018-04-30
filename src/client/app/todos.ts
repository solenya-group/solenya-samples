import { Component, div, ul, li, inputText, commandLink, span, input } from 'pickle-ts'
import { myInput, icon } from '../util/util'
import { style } from 'typestyle'
import { slideChildren } from '../util/animations'
import { Type } from 'class-transformer'

enum TaskType { active = "active", done = "done", all = "all" }

export class Todos extends Component
{
    @Type(() => TaskItem) list: TaskItem[] = []
    currentTaskType = TaskType.all
    currentText?: string

    addTask() {
        this.update(() => {
            this.list = this.list.concat(new TaskItem(this.currentText))
            this.currentText = undefined
        })
    }

    toggleTaskStatus(item: TaskItem) {
        this.update(() => {
            item.done = !item.done
        })
    }

    removeTask(item: TaskItem) {
        this.update(() => {
            this.list = this.list.filter(i => i != item)
        })
    }

    updateListFilter(type: TaskType) {
        this.update(() => {
            this.currentTaskType = type
        })
    }

    clearCompleted() {
        this.update(() => {
            this.list = this.list.filter(i => !i.done)
        })
    }

    filteredList() {
        return (
            this.currentTaskType == TaskType.all ? this.list :
                this.currentTaskType == TaskType.done ? this.list.filter(i => i.done) :
                    this.list.filter(i => !i.done)
        )
    }

    view() {
        return div(
            this.linksView(),
            this.inputView(),
            this.listView()
        )
    }

    linksView() {
        return (
            div({ class: "mr-2", style: { display: 'flex' } },
                linkListView(
                    [TaskType.all, TaskType.done, TaskType.active],
                    this.currentTaskType,
                    link => this.updateListFilter(link)
                ),
                commandLink(() => this.clearCompleted(), { class: "ml-4" }, "clear completed")
            )
        )
    }

    inputView() {
        return (
            div({ class: "my-2" },
                inputText(
                    () => this.currentText,
                    e => this.updateProperty(e),
                    {
                        class: placeholderClass,
                        style: { padding: '1rem' },
                        placeholder: "What needs to be done?",
                        onkeyup: (e: any) => {
                            if (e.keyCode == 13 && this.currentText && !this.list.find(l => l.name == this.currentText))
                                this.addTask()
                        }
                    }
                )
            )
        )
    }

    listView() {
        return ul(slideChildren(),
            this.filteredList().map(task => task.view(() => this.removeTask(task)))
        )
    }
}

export class TaskItem extends Component {
    name = ""
    done = false

    constructor(name?: string) {
        super()
        if (name)
            this.name = name
    }

    toggleStatus() {
        this.update(() => this.done = !this.done)
    }

    view(remove?: () => void) {
        return (
            li({ key: this.name, class: hoverArea },
                commandLink(remove!, { class: showOnHover }, icon ("close")),
                input({
                    type: "checkbox",
                    checked: this.done ? "checked" : undefined,
                    onclick: () => this.toggleStatus()
                }),
                span(
                    !this.done ?
                        this.name :
                        span({ style: { textDecoration: 'line-through', color: "lightgray" } },
                            this.name
                        )
                )
            )
        )
    }
}

export function linkListView<T>(links: T[], currentLink: T, updateLink: (link: T) => void) {
    return links.map(link =>
        commandLink(() => updateLink(link), {
            class: "mx-2",
            style: link == currentLink ? "text-decoration:underline" : ""
        },
            link
        )
    )
}

const placeholderClass = style({
    $nest: {
        "&::placeholder": {
            color: "lightgray"
        }
    }
})

export const showOnHover = style({})

export const hoverArea = style(<any>{
    $nest: {
        ['.' + showOnHover]: {
            color: "transparent"
        },
        "&:hover": {
            ['.' + showOnHover]: {
                color: "blue"
            }
        }
    }
})