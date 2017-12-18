import { Component, div, commandButton, css } from 'pickle-ts'

export class TimeTravel extends Component
{
    count: number = 0

    view () {
        return div (
            div ("To time travel, in the console:"),
            div(css ("code"),                
                div ("var t = window.app.time"),
                div ("t.prev()"),
                div ("t.next()"),
                div ("t.start()"),
                div ("t.seek (state => state.counter.count == 0)")
            ),
            myButton (() => this.add(1), "+"),
            this.count,
            div ("To save state to local storage on updates, edit this line in boot.cs, passing in true:"),
            div (css ("code"), 'window["app"] = new App (Samples, "app", true)'),
            div ("One scenario when this is useful is developing/debugging.")
        )
    }
    
    add (x: number) {
        return this.update (() => this.count += x)
    } 
}

function myButton (onclick: () => void, content: any) {
    return commandButton (onclick, content, css("m-2", "btn", "btn-outline-primary"))
}