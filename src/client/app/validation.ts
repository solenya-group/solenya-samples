import { Exclude } from 'class-transformer'
import { IsNotEmpty, IsNumber, Max, MaxLength, Min, MinLength } from 'class-validator'
import { Component, Num, VElement, div, Validator, IValidated } from 'pickle-ts'
import { inputCurrency, myButton, myInput } from '../util/util'
import { superInput } from '../util/validation'

export class ValidationSample extends Component implements IValidated
{        
    @Exclude() validator:Validator = new Validator (this)

    @MinLength(3) @MaxLength(10) @IsNotEmpty()   username = ""
    @Num() @Min(0) @Max(10)                      rating = NaN
    @Num() @IsNumber()                           bonus = NaN

    ok() {
        this.validator.validateThenUpdate()
    }

    updated (payload: any) {
        if (this.validator.wasValidated)
            this.validator.validateThenUpdate (payload)  
    }

    view () : VElement {           
        return div (  
            superInput (myInput, this, () => this.username, "Username"),
            superInput (myInput, this, () => this.rating, "Rating"),
            superInput (inputCurrency, this, () => this.bonus, "Bonus"),
            div (
                myButton(() => this.ok(), "ok")
            )
        )       
    }
}