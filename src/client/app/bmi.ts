import { Component, div, HProps, inputRange, VElement, getFriendlyName, getPropertyValue, PropertyRef } from 'pickle-ts'

export class BMI extends Component
{
    height = 180
    weight = 80

    calc () {
        return this.weight / (this.height * this.height / 10000)
    }

    view(): VElement {
        return div(
          div({ class: "row" },
            this.inputRangeUnit (() => this.height, "cm", { min: 100, max: 250, step: 1 }),
            this.inputRangeUnit (() => this.weight, "kilos", { min: 25, max: 250, step: 1 }),
          ),
          div({ class: "display-2" }, this.calc().toFixed(1))
        )
      }
    
      inputRangeUnit<T> (prop: PropertyRef<number>, unit: string, attrs: HProps) {
        return div({ class: "col" },
           div (getFriendlyName (this, prop)),
           inputRange ({ component: this, prop, attrs}),       
           div (getPropertyValue ({component: this, prop}) + unit)
        )
      }
}