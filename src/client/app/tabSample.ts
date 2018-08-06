import { Component, div, commandButton, VElement } from 'pickle-ts' 
import { Type } from 'class-transformer'
import { TabGroup, ComponentTabGroup } from '../util/tabGroup'

export class TabSample extends ComponentTabGroup
{  
    apple = new MyTabContent ("Apples are delicious")
    banana = new MyTabContent ("But bananas are ok")
    cantaloupe = new MyTabContent ("Cantaloupe that's what I'm talking about.")
}

class MyTabContent extends Component {
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