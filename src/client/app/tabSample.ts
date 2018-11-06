import { Component, div, commandButton, VElement, IRouted, Router } from 'pickle-ts'
import { Type } from 'class-transformer'
import { TabGroup } from '../util/tabGroup'

export class TabSample extends TabGroup
{  
    apple = new MyTabContent ("Apples are delicious")
    banana = new MyTabContent ("But bananas are ok")
    cantaloupe = new MyTabContent ("Cantaloupe that's what I'm talking about.")
}

class MyTabContent extends Component
{
    data = ""

    constructor(data?: string) {
        super()
        if (data)
            this.data = data
    }

    view() {
        return div (this.data)
    }
}