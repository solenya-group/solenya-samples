import { Component, div } from 'solenya'
import { Counter } from './counter'

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