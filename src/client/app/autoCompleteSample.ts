import { Component, Let } from 'pickle-ts'
import { AutoComplete } from '../util/autoComplete'

export class AutoCompleteSample extends Component
{
    countries: string[] = []

    get languagesAutoComplete() : AutoComplete {    
        return AutoComplete.transient (this, () => this.countries, {
            isMultiSelect: true,
            modelToLabel: countryCodeToLabel,
            labelToModel: countryLabelToCode,
            suggestor: async searchText => {
                const reg = new RegExp (searchText, "i")
                return countries.filter (l => reg.test (l.label)).map(l => l.label)
            }
        })                    
    }

    view() {
        return this.languagesAutoComplete.view()
    }
}

const countryCodeToLabel = (code: string) => Let (countries.find (c => c.code == code), c => c ? c.label : "")
const countryLabelToCode = (label: string) => Let (countries.find (c => c.label == label), c => c ? c.code : "")

const countries = [
    {code: "UK", label: "United Kingdom"},
    {code: "USA", label: "United States of America"},
    {code: "NZ", label: "New Zealand"},
    {code: "AUS", label: "Australia"}    
]