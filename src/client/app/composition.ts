import { Component, div } from 'pickle-ts'
import { Counter } from './Counter'
import { Type } from 'class-transformer'

export class Composition extends Component
{    
    @Type (() => Counter) counter1: Counter = new Counter (this)
    @Type (() => Counter) counter2: Counter = new Counter (this)

    view () {
        return div (   
            this.counter1.view (),
            this.counter2.view ()
        );
    }
}