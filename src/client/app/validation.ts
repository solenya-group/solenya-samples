import { VElement, div, Num } from 'pickle-ts'
import { IsNumber, IsNotEmpty, Min, Max, MinLength, MaxLength } from 'class-validator'
import { MyForm, superInput } from '../util/validation'
import { myInput, myButton, inputCurrency } from '../util/util'

export class ValidationSample extends MyForm
{        
    @MinLength(3) @MaxLength(10) @IsNotEmpty()   username = ""
    @Num() @Min(0) @Max(10)                      rating = NaN
    @Num() @IsNumber()                           bonus = NaN

    ok() {
        this.update(() => { this.validated = true })
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
