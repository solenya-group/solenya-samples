import { Component, Let } from 'pickle-ts'
import { AutoComplete, mapPropertyFromTo } from '../util/autoComplete'

export class AutoCompleteSample extends Component
{
    countries: string[] = []

    get languagesAutoComplete() : AutoComplete {    
        return AutoComplete.transient (this, () => this.countries, {
            isMultiSelect: true,
            modelToLabel: mapPropertyFromTo (countries, x => x.code, x => x.label),
            labelToModel: mapPropertyFromTo (countries, x => x.label, x => x.code),
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

const countries = [
    {code: "UK", label: "United Kingdom"},
    {code: "USA", label: "United States of America"},
    {code: "NZ", label: "New Zealand"},
    {code: "AUS", label: "Australia"}    
]