import { Component, slider, div, ul, li, a, key, inputText, KeyValue, isNullOrEmpty } from 'pickle-ts'
import { debounce } from 'lodash-decorators'
import { Exclude } from 'class-transformer'
import { myInput } from '../util/util'

export class GitSearch extends Component
{
    searchText?: string = undefined
    results: any[] = []

    view () {       
        return div (
            myInput (() => this.searchText, e => this.searchTextChange (e)),
            ul (this.results.map (
                result =>
                    li (
                        a ({href: result.html_url}, result.name)
                    )
                )
            )
        )
    }

    searchTextChange (payload: KeyValue) {
        this.updateProperty (payload)
        if (! isNullOrEmpty (payload.value))
            this.search (payload.value!)
    }   

    @Exclude()
    @debounce (500)    
    async search (search: string) {
        var result = await fetch ("https://api.github.com/search/repositories?q=" + encodeURI (search))
        if (result.ok) {
            var body = await result.json()
            this.update (() => this.results = body.items)
        }
    }
}
