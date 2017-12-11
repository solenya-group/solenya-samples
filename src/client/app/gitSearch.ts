import { Component, slider, div, ul, li, a, key, inputer, KeyValue, isNullOrEmpty } from 'pickle-ts'
import { debounce } from 'lodash'

export class GitSearch extends Component
{
    searchText?: string = ""
    results: any[] = []

    view () {       
        return div (
            inputer (() => this.searchText, e => this.searchTextChange (e)),
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
            debounce(() => this.search (payload.value), 500)()
    }

    async search(search: string) {
        var result = await fetch ("https://api.github.com/search/repositories?q=" + encodeURI (search))
        if (result.ok) {
            var body = await result.json()
            this.update (() => this.results = body.items)
        }
    }
}