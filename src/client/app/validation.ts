import { Exclude } from 'class-transformer'
import { Component, div, Label, Validator, VElement, radioGroup, selector } from 'pickle-ts'
import { box, inputCurrency, myButton, myInputNumber, myInputText } from '../util/util'
import { inputUnit } from '../util/validation'
import { vIsNotEmpty, vIsNumber, vLengthRange, vMax, vMin } from '../util/validationDecorators'

enum Color {
    Red = "red",
    Green = "green",
    Blue = "blue"
}

export class ValidationSample extends Component
{        
    @Exclude() validator:Validator = new Validator (this)

    @Label ("Your User Name") @vLengthRange (3, 10) @vIsNotEmpty()       username?: string
    @vMin(0) @vMax(10)                                                   rating?: number
    @vIsNumber()                                                         bonus?: number
    @vIsNotEmpty()                                                       color?: Color

    ok() {
        this.validator.validateThenUpdate()
    }

    updated (payload: any) {
        if (this.validator.wasValidated)
            this.validator.validateThenUpdate (payload)  
    }

    view () : VElement {           
        return box (
            inputUnit (this, () => this.username, props => myInputText (props)),            
            inputUnit (this, () => this.rating, props => myInputNumber (props)),
            inputUnit (this, () => this.bonus, props => inputCurrency (props)),
            inputUnit (this, () => this.color, props =>
                selector ({
                    ...props,
                    hasEmpty: true,
                    attrs: { class: "form-control"},
                    options: [Color.Red, Color.Green, Color.Blue].map (c => ({ label: c, value: c})),                    
                })                            
            ),
            div (
                myButton ({ onclick: () => this.ok() }, "ok")
            )
        )       
    }
}