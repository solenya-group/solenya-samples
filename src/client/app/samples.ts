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
import { Stopwatch } from './stopwatch'

import { slide } from '../util/animations'
import createHistory from 'history/createBrowserHistory'
import { layout, layoutHeader, layoutContent, layoutFooter } from '../util/styles'

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
    @Type (() => AnimateElement) animateElement = new AnimateElement ()
    @Type (() => AnimateList) animateList = new AnimateList ()
    @Type (() => Stopwatch) stopwatch = new Stopwatch ()

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
            div ({ class: layout },
                div ({ class: layoutHeader }),
                main ({ class: layoutContent + ' d-flex'},
                    div ({ class: 'p-3', style: { width: '250px', zIndex: 1000, backgroundColor: 'white' } },
                        div ({ class: 'mb-3', style: { backgroundImage: `url('/dist//pickle.png')`, backgroundSize: 'cover', width: '100px', height: '100px' } } ),
                        ul (
                            this.childrenKeys().map (key =>
                                li ({ class: 'nav-item'},
                                    commandLink (() => this.changePage (key), { class: 'nav-link' },
                                        decamel(key)
                                    )
                                )
                            )
                        )
                    ),                    
                    div (slide (),
                        div ({ key: this.current },
                            div ({ class: 'col'},
                                h1 ({ class: 'py-3' }, decamel (this.current)),
                                this[this.current].view()
                            )
                        )
                    )
                ),
                div ({ class: layoutFooter })
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