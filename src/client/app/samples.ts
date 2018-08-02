import { Exclude, Type } from 'class-transformer'
import { Component, div, h1, key, li, main, ul, IRouted, Router } from 'pickle-ts'
import { slide } from '../util/animations'
import { layout, layoutContent, layoutFooter, layoutHeader } from '../util/styles'
import { AnimateElement } from './animateElement'
import { AnimateList } from './animateList'
import { AutoCompleteSample } from './autoCompleteSample'
import { BMI } from './bmi'
import { Composition } from './composition'
import { Counter } from './counter'
import { GitSearch } from './gitSearch'
import { ModalSample } from './modalSample'
import { Relativity } from './relatvity'
import { Stopwatch } from './stopwatch'
import { TabSample } from './tabSample'
import { TableSample } from './tableSample'
import { TimeTravel } from './timeTravel'
import { Todos } from './todos'
import { Tree } from './tree'
import { ValidationSample } from './validation'

export class Samples extends Component implements IRouted
{
    @Exclude() router:Router = new Router (this)
    @Exclude() routeName = ""

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
    @Type (() => TabSample) tabSample = new TabSample ()
    @Type (() => Relativity) relativity = new Relativity ()
    @Type (() => AutoCompleteSample) autoComplete = new AutoCompleteSample()
    @Type (() => ValidationSample) validationSample = new ValidationSample ()
        
    attached()
    {
        this.initRoutes()
    }

    initRoutes()
    {
        for (var k of this.childrenKeys()) {
            var c = this[k]
            c.router = new Router (c)
            c.routeName = k
        }            
        this.router.navigate (location.pathname != "/" ? location.pathname : key (() => this.relativity))
        this.router.followHistory()
    }

    childRoute (name: string) {        
        return this[name]
    }

    view () {        
        document.title = `Pickle - ${decamel (this.router.currentChildName)} sample`

        return (
            div ({ class: layout },
                div ({ class: layoutHeader }),
                main ({ class: layoutContent + ' d-flex'},
                    div ({ class: 'p-3', style: { width: '250px', zIndex: 1000, backgroundColor: 'white' } },
                        div ({ class: 'mb-3', style: { backgroundImage: `url('/dist//pickle.png')`, backgroundSize: 'cover', width: '100px', height: '100px' } } ),
                        ul (
                            this.childrenKeys().map (key =>
                                li ({ class: 'nav-item'},
                                    this.router.navigateLink (key, { class: 'nav-link p-1' },
                                        decamel(key)
                                    )
                                )
                            )
                        )
                    ),                    
                    div (slide (),
                        div ({ key: this.router.currentChildName },
                            div ({ class: 'col'},
                                h1 ({ class: 'py-3' }, decamel (this.router.currentChildName)),
                                this.router.currentChildComponent!.view()
                            )
                        )
                    )
                ),
                div ({ class: layoutFooter })
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