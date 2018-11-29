import { Component, VElement, div, ul, li, commandLink, span, isNullOrEmpty, checkbox } from  'pickle-ts'
import { myInputText, closeButton } from '../util/util'
import { style } from 'typestyle'
import { Type } from 'class-transformer'

enum TaskType { active = "active", done = "done", all = "all" }

class TaskItem extends Component {
  name = ""
  done = false

  constructor(name?: string) {
    super()
    if (name)
      this.name = name
  }

  view(remove?: () => void): VElement {
    return (
      li({ key: this.name, class: hoverArea + " d-flex" },
        closeButton ({
            onclick: remove!,
            class: showOnHover             
        }),
        checkbox ({
            target: this,
            prop: () => this.done,
            prefix: this.name,    
            label: this.name,
            labelAttrs: {class: "pl-1 " + (! this.done ? "" : crossOut)}
         })
      )
    )
  }
}

function linkListView<T>(links: T[], currentLink: T, updateLink: (link: T) => void) {
  return links.map(link =>
    commandLink({ onclick: () => updateLink(link) },
      span({
        class: 'px-1',
        style: link != currentLink ? {} : { textDecoration: "underline" }
      },
        link
      )
    )
  )
}

export class Todos extends Component {
  @Type(() => TaskItem) list: TaskItem[] = []
  currentTaskType = TaskType.all
  currentText?: string

  addTask() {
    this.update(() => {
      this.list = this.list.concat(new TaskItem(this.currentText))
      this.currentText = undefined
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

  linksView() {
    return (
      div({ class: 'mb-2' },
        linkListView([TaskType.all, TaskType.done, TaskType.active], this.currentTaskType, link => this.updateListFilter(link)),
        commandLink({ onclick: () => this.clearCompleted(), class: "ml-4" }, "clear completed")
      )
    )
  }

  inputView(): VElement {
    return (
      div({ class: "input-group" },
        myInputText({
          target: this,
          prop: () => this.currentText,
          attrs: {
            class: placeholderClass,
            placeholder: "What needs to be done?",
            onkeyup: e => {
              if (e.keyCode == 13 && !isNullOrEmpty(this.currentText) && !this.list.find(l => l.name == this.currentText))
                this.addTask()
            }
          }
        })
      )
    )
  }

  listView() {
    return ul({ class: 'my-2' },
      this.filteredList().map(task => task.view(() => this.removeTask(task)))
    )
  }

  view() {
    return div(
      this.linksView(),
      this.inputView(),
      this.listView(),
      div("To autosave the todo list to local storage, go to the console and type: window.app.storage.autosave = true")
    )
  }
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

export const crossOut = style({
  textDecoration: 'line-through',
  color: "lightgray"
})