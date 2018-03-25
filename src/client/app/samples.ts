import { Component, div, ul, li, a, main, h1, commandLink } from 'pickle-ts'
import { Type, Exclude } from 'class-transformer'
import { Counter } from './counter'
import { BMI } from './bmi'
import { GitSearch } from './gitSearch'
import { Todos } from './todos'
import { TableSample } from './tableSample'
import { TimeTravel } from './timeTravel'
import { Composition } from './composition'
import { Tree } from './tree'
import { ModalSample } from './modalSample'
import { AnimateElement } from './animateElement'
import { AnimateList } from './animateList'
import { slideRight } from '../util/animations'
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
    @Type (() => ModalSample) modalSample = new ModalSample()
    @Type (() => AnimateElement) animteElement = new AnimateElement ()
    @Type (() => AnimateList) animteList = new AnimateList ()

    current: string

    constructor()
    {
        super ()   
        this.current = location.pathname == "/" ? "counter" : location.pathname.substring(1)
    }

    changePage (name: string)
    {
        this.update (() => this.current = name)
        if (history.location.pathname != "/" + name)                
            history.push (name) 
    }

    view () {
        return (
            div ({class: "xlayout"},
                div ({class: "xrow xheader"}),
                main ({class: "xrow xcontent d-flex"},
                    div ({class: "left-pane p-3"},
                        div ({ class: "my-heading mb-3"}),                        
                        ul (
                            this.childrenKeys().map (key =>
                                li({class: "nav-item"},
                                    commandLink (() => this.changePage (key), {class: "nav-link"},
                                        decamel(key)
                                    )
                                )
                            )         
                        )
                    ),                    
                    slideRight (
                        div ({key: this.current},
                            div({class: "col"},
                                h1 ({ class: "py-3" }, decamel (this.current)),                        
                                this[this.current].view()
                            )
                        )
                    )
                ),
                div({class: "xrow xfooter"})
            )
        )
    }    

    childrenKeys() {
        return Object.keys (this).filter (k => this[k] instanceof Component && k != "slide")
    }
}

function decamel (str: string) {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase() )
}   