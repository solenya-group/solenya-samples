import { transient, Component, div, h1, key, li, main, ul, IRouted, Router, humanizeIdentifier, img } from 'solenya'
import { transitionChildren } from 'solenya-animation'
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
    @transient router:Router = new Router (this)
    @transient routeName = ""

    counter = new Counter ()
    bmi = new BMI ()    
    gitSearch = new GitSearch ()
    todos = new Todos ()
    tableSample = new TableSample ()
    timeTravel = new TimeTravel ()
    composition = new Composition ()
    tree = new Tree ()
    modalSample = new ModalSample()
    animateElement = new AnimateElement ()
    animateList = new AnimateList ()
    stopwatch = new Stopwatch ()
    tabSample = new TabSample ()
    relativity = new Relativity ()
    autoComplete = new AutoCompleteSample()
    validationSample = new ValidationSample ()
        
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
    }

    view () {        
        document.title = `Solenya - ${humanizeIdentifier (this.router.currentChildName)} sample`

        return (
            div ({ class: layout },
                div ({ class: layoutHeader }),
                main ({ class: layoutContent + ' d-flex'},
                    div ({ class: 'p-3', style: { width: '250px', zIndex: 1000, backgroundColor: 'white' } },
                        img ({ src: '/client/images/logo.svg', class: "mb-3", style: { width: '4rem' } } ),
                        ul (
                            this.childrenKeys().map (key =>
                                li ({ class: 'nav-item ' + (key == this.router.currentChildName ? "font-weight-bold": "") },
                                    this.router.navigateLink (key, { class: 'nav-link p-1' },
                                        humanizeIdentifier(key)
                                    )
                                )
                            )
                        )
                    ),                    
                    div (transitionChildren ({kind: "fade"}),
                        div ({ key: this.router.currentChildName },
                            div ({ class: 'col'},
                                h1 ({ class: 'py-3' }, humanizeIdentifier (this.router.currentChildName)),
                                this.router.currentChildComponent!.view()
                            )
                        )
                    )
                ),
                div ({ class: layoutFooter })
            )
        )
    }   
}