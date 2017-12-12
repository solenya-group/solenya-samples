import { Component, div, button, ul, li, a, css, h2 } from 'pickle-ts'
import { Type } from 'class-transformer'
import createHistory from 'history/createBrowserHistory'
import { Counter } from './counter'
import { BMI } from './bmi'
import { GitSearch } from './gitSearch'
import { Composition } from './composition'
import { Todos } from './todos'

const history = createHistory()

export class Samples extends Component
{
    @Type (() => Counter) counter = new Counter (this)
    @Type (() => BMI) bmi = new BMI (this)
    @Type (() => Composition) composition = new Composition (this)
    @Type (() => GitSearch) gitSearch = new GitSearch (this)
    @Type (() => Todos) todos = new Todos (this)

    activeAppName: string

    constructor(parent?: Component)
    {
        super (parent)   
        const path = location.pathname.substring(1)
        this.changePage (path != "" ? path : "counter" )
    }

    changePage (name: string)
    {
        this.update(() => {
            this.activeAppName = name
            if (history.location.pathname != "/" + name)                
                history.push (name)            
        })
    }

    view () {
        return (
            div (
                div (
                    div ("To time travel, in the console:"),
                    div ("var t = window.app.time"),
                    div ("t.start()"),
                    div ("t.next()"),
                    div ("t.seek (state => state.counter.count == 0)")
                ),
                ul (
                    this.childrenKeys().map (key =>
                        li (
                            a({onclick: () => this.changePage (key)}, key)
                        )
                    ),            
                ),
                div (
                    h2 (this.activeAppName),
                    this[this.activeAppName].view()
                )
            )
        )
    }    

    childrenKeys() {
        return Object.keys (this).filter (k => this[k] instanceof Component)
    }
}