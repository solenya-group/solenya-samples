import { Component, div } from 'pickle-ts'
import { Counter } from './counter'
import { Type } from 'class-transformer'

export class Composition extends Component
{    
    counter1 = new Counter ()
    counter2 = new Counter ()

    view () {
        return div (   
            this.counter1.view (),
            this.counter2.view ()
        )
    }
}