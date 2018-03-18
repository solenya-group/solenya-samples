import { Component, slider, div, label } from 'pickle-ts'

export class BMI extends Component
{
    height = 180
    weight = 80

    calc () {
        return this.weight / (this.height * this.height / 10000)
    }

    view () {           
        return div (  
            this.mySlider (() => this.height, 100, 250, "Height", "cm"),
            this.mySlider (() => this.weight, 25, 150, "Weight", "kg"),
            div({class: "display-2"}, this.calc().toFixed(1))
        )
    }

    mySlider (prop: () => void, min: number, max: number, text: string, unit: string) {
        return (
            div({ class: "form-group"},
                label (text),
                slider (prop, min, max, 1, e => this.updateProperty(e), {class: "form-control"}),
                prop() + " " + unit
            )
        )
    }
}