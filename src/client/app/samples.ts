import { Component, css, div, ul, li, a, main, h1, commandLink } from 'pickle-ts'
import { Type } from 'class-transformer'
import { Counter } from './counter'
import { BMI } from './bmi'
import { GitSearch } from './gitSearch'
import { Todos } from './todos'
import { TableSample } from './tableSample'
import { TimeTravel } from './timeTravel'
import { Composition } from './composition'
import { Tree } from './tree'
import { ModalSample } from './modalSample'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()

export class Samples extends Component
{
    @Type (() => Counter) counter = new Counter ()
    @Type (() => BMI) bmi = new BMI ()    
    @Type (() => GitSearch) gitSearch = new GitSearch ()
    @Type (() => Todos) todos = new Todos ()
    @Type (() => TableSample) tableSample = new TableSample ()
    @Type (() => TimeTravel) timeTravel = new TimeTravel ()
    @Type (() => Composition) composition = new Composition ()
    @Type (() => Tree) tree = new Tree ()
    @Type (() => ModalSample) modalSample = new ModalSample ()

    activeAppName: string

    constructor()
    {
        super ()   
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
                div(css ("navbar", "navbar-expand-md", "navbar-dark", "bg-light"),
                    div (css ("container"),
                        ul (css ("nav"),
                            this.childrenKeys().map (key =>
                                li(css("nav-item"),
                                    commandLink  (() => this.changePage (key),
                                        css("nav-link"),
                                        decamel(key)
                                    )
                                )
                            )         
                        )
                    )
                ),
                main (
                    div (css ("container"),                        
                        h1 (css("py-3"), decamel (this.activeAppName)),
                        this[this.activeAppName].view()
                    )
                )
            )
        )
    }    

    childrenKeys() {
        return Object.keys (this).filter (k => this[k] instanceof Component)
    }
}

function decamel (str: string) {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase() )
}