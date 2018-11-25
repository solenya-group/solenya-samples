import { Exclude } from 'class-transformer'
import { IsNotEmpty, IsNumber, Max, MaxLength, Min, MinLength } from 'class-validator'
import { checkbox, Component, div, Label, radioGroup, selector, Validator, VElement } from 'pickle-ts'
import { inputCurrency, myButton, myInputNumber, myInputText } from '../util/util'
import { superInput } from '../util/validation'

enum Color {
    Red = "red",
    Green = "green",
    Blue = "blue"
}

export class ValidationSample extends Component
{        
    @Exclude() validator:Validator = new Validator (this)

    @MinLength(3) @MaxLength(10) @IsNotEmpty()   username?: string
    @Min(0) @Max(10)                             rating?: number
    @IsNumber()                                  bonus?: number

    ok() {
        this.validator.validateThenUpdate()
    }

    updated (payload: any) {
        if (this.validator.wasValidated)
            this.validator.validateThenUpdate (payload)  
    }

    view () : VElement {           
        return div (
            superInput (this, myInputText, () => this.username, {}, "Username"),
            superInput (this, myInputNumber, () => this.rating, {}, "Rating"),
            superInput (this, inputCurrency, () => this.bonus, {}, "Bonus"),
            div (
                myButton ({onclick: () => this.ok() }, "ok")
            )
        )       
    }
}

const myRadioProps = { 
    optionAttrs: { class: "custom-control custom-radio" },
    inputAttrs: { class: "custom-control-input" },
    labelAttrs: { class: "custom-control-label" }
}