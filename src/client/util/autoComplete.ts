import { Component, HValue, div, inputer, KeyValue, isNullOrEmpty, commandButton, span, commandLink } from 'pickle-ts'
import { debounce } from 'lodash-decorators'
import { Exclude } from 'class-transformer'
import { icon } from '../util/util'

export class AutoComplete extends Component
{    
    selections: string[] = []    
    searchText?: string = undefined
    isMultiSelect = false
    suggestionLimit = 10

    @Exclude() suggestions: string[] = []
    @Exclude() suggestor?: (searchText: string) => Promise<string[]>

    @Exclude() private static idCount = 0
    @Exclude() private id: string

    constructor() {
        super()
        this.id = "autoComplete" + (AutoComplete.idCount + 1)
    }

    view (inputProps?: HValue) {  
        return div ({ class: 'input-group'},
            this.selectionsView(),
            this.searchTextView (inputProps),
            this.suggestionsView ()
        )
    }

    private searchTextView (inputProps?: HValue) {
        return (
            inputer(
                () => this.searchText,
                e => this.searchTextChange (e),
                {id : this.id},
                inputProps
            )
        )
    }

    private searchTextChange(payload: KeyValue) {         
        if (this.searchText == payload.value)
            return
        this.updateProperty (payload)
        this.autocomplete (payload.value!)    
    }
    
    @Exclude()
    @debounce (300)    
    private async autocomplete (search: string) {
        if (! this.suggestor)
            return
        if (isNullOrEmpty(search)) {
            this.suggestions = []
            return
        }
        var suggestions = await this.suggestor (search)
        this.update(() => {            
            const reg = new RegExp (search, "i")
            this.suggestions = suggestions
                .filter (s => reg.test (s) && this.selections.indexOf (s) == -1)
                .slice (0, this.suggestionLimit)              
        })
    }

    private selectionsView() {
        return (
            ! this.isMultiSelect ? undefined :
            this.selections.map (sel =>
                div ({class: 'input-group-prepend'}, 
                    div ({class: 'input-group-text'},
                        span ({class: 'px-1'}, sel),
                        commandButton(
                            () => this.removeSelection (sel),
                            { class: 'close' }, icon ("close", { style: { fontSize: '16px' } })
                        )
                    )
                )
            )
        )
    }

    private removeSelection (sel: string) {
        this.update (() => this.selections = this.selections.filter (s => s != sel))
    }

    private suggestionsView () {
        return (           
            ! this.suggestions.length ? undefined :
            div ({ class:'dropdown-menu', style: { display: 'block' } },
                this.suggestions.map (s =>
                    commandLink(() => this.selectSuggestion (s), {class: 'dropdown-item'}, s)
                )
            )
        )
    }

    private selectSuggestion (suggestion: string) {        
        this.update(() => {
            this.searchText = this.isMultiSelect ? "" : suggestion
            this.selections = this.isMultiSelect ? this.selections.concat (suggestion) : []
            this.suggestions = []               
            this.onRefreshed(() => $("#" + this.id).focus())
        })
    }
}