import { Exclude } from 'class-transformer'
import { debounce } from 'lodash-decorators'
import { a, Component, isNullOrEmpty, li, ul, VElement } from 'pickle-ts'
import { box, myInputText } from '../util/util'

export class GitSearch extends Component
{
    _searchText = ""

    get searchText () {return this._searchText}

    set searchText (value: string) {
        this.update (() => {
            this._searchText = value
            if (isNullOrEmpty (value))
                this.results = []
            else
                this.search (value)    
        })
    }

    results: any[] = []

    view () : VElement {       
        return box (
            myInputText ({ target: this, prop: () => this.searchText }),
            ul (this.results.map (
                result =>
                    li (
                        a ({href: result.html_url}, result.name)
                    )
                )
            )
        )
    }

    @Exclude()
    @debounce (500)    
    async search (search: string) {
        var result = await fetch ("https://api.github.com/search/repositories?q=" + encodeURI (search))
        if (result.ok) {
            var body = await result.json()
            this.update (() => {
                this.results = body.items
            })
        }        
    }
}
