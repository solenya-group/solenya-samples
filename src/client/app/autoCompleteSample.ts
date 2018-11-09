import { Component, Let } from 'pickle-ts'
import { AutoComplete, mapPropertyFromTo } from '../util/autoComplete'
import { Exclude } from 'class-transformer'

export class AutoCompleteSample extends Component
{
    countries: string[] = []

    @Exclude() countriesAutoComplete: AutoComplete =
        new AutoComplete (this, () => this.countries, {
            isMultiSelect: true,
            modelToLabel: mapPropertyFromTo (countries, c => c.code, c => c.label),
            labelToModel: mapPropertyFromTo (countries, c => c.label, c => c.code),
            suggestor: async searchText => {
                const reg = new RegExp (searchText, "i")
                return countries.filter (l => reg.test (l.label)).map(l => l.label)
            }
        })  

    view() {
        return this.countriesAutoComplete.view()
    }
}

const countries = [
    {code: "UK", label: "United Kingdom"},
    {code: "USA", label: "United States of America"},
    {code: "NZ", label: "New Zealand"},
    {code: "AUS", label: "Australia"}    
]