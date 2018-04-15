import { Component, div } from 'pickle-ts'
import { myButton } from '../util/util'
import { codeClass } from '../util/styles'

export class TimeTravel extends Component
{
    count: number = 0

    view () {
        return div (
            div ("To time travel, in the console:"),
            div ({ class: codeClass },
                div ("var t = window.app.timeTravelOn = true"),
                div ("var t = window.app.time"),
                div ("t.prev()"),
                div ("t.next()"),
                div ("t.start()"),
                div ("t.seek (state => state.counter.count == 0)")
            ),
            myButton (() => this.add(1), "+"),
            this.count,
            div ("To save state to local storage on updates:"),
            div ({ class: codeClass }, 'window.app.storage.autosave = true'),
            div ("One scenario when this is useful is developing/debugging. You can change your code, save it, and the page will automatically reload using your previous state.")
        )
    }
    
    add (x: number) {
        return this.update (() => this.count += x)
    } 
}