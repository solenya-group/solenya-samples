import { Component, div, HProps, inputRange, label, VElement, getFriendlyName, getPropertyValue, PropertyRef } from 'pickle-ts'

export class BMI extends Component
{
    height = 180
    weight = 80

    calc () {
        return this.weight / (this.height * this.height / 10000)
    }

    view () : VElement {           
        return div (
            this.unitRange (() => this.height, {min: 100, max: 250, step: 1}, "cm"),
            this.unitRange (() => this.weight, {min: 25, max: 150, step: 1}, "kg"),
            div ({ class: "display-2" }, this.calc().toFixed(1))
        )
    }

    unitRange (prop: PropertyRef<number>, inputRangeAttrs: HProps, unit: string) {
        return (
            div ({ class: "form-group" },
                label (getFriendlyName (this, prop)),                
                inputRange (this, prop, {}, inputRangeAttrs, { class: "form-control" }),
                getPropertyValue (this, prop) + " " + unit
            )
        )
    }
}