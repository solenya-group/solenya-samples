import { Component, slider, div, css, label, form } from 'pickle-ts'

export class BMI extends Component
{
    height: number = 180
    weight: number = 80

    calc () {
        return this.weight / (this.height * this.height / 10000)
    }

    view () {           
        return form (  
            this.mySlider (() => this.height, 100, 250, "Height", "cm"),
            this.mySlider (() => this.weight, 25, 150, "Weight", "kg"),
            div (css ("display-2"), this.calc().toFixed(1))
        )
    }

    mySlider (prop: () => void, min: number, max: number, text: string, unit: string) {
        return (
            div (css ("form-group"),
                label (text),
                slider (prop, min, max, 1, e => this.updateProperty (e), css ("form-control")),
                prop() + " " + unit
            )
        )
    }
}