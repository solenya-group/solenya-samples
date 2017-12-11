import { Component, slider, div, br } from 'pickle-ts'

export class BMI extends Component
{
    height: number = 180
    weight: number = 80

    calc () {
        return this.weight / (this.height * this.height / 10000)
    }

    view () {       
        return div (             
            div ("height", slider (() => this.height, 100, 250, 1, e => this.updateProperty (e)), this.height),
            div ("weight", slider (() => this.weight, 30, 150, 1, e => this.updateProperty (e)), this.weight),
            div ("bmi: " + this.calc())
        )
    }
}