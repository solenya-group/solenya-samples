import * as $ from "jquery"
import { debounce } from 'lodash-decorators'
import { commandLink, Component, div, HAttributes, inputText, isNullOrEmpty, span, VElement, getPropertyKey, DatabindProps, PropertyRef, prefixId, transient } from 'solenya'
import { style } from 'typestyle'
import { closeButton } from '../util/util'

interface IAutoCompleteProps<T>
{
    prefix: string
    isMultiSelect : boolean
    suggestionLimit: number
    isRealtime: boolean
    isSuggestion: boolean
    autoFilter: boolean
    showNoResultsFound: boolean
    autoSelectSingleResult: boolean
    allowNonSuggestions: boolean
    preload: boolean
    looseMatch: boolean
    suggestor?: (searchText: string) => Promise<string[]>
    labelToModel?: (label: string) => T
    modelToLabel?: (model: T) => string
    onSelectEvent?: (selection: string | string[]) => void    
}

export type AutoCompleteProps<T> = Partial<IAutoCompleteProps<T>> & DatabindProps<T|T[]>

const KeyCode = {
    Enter: 13,
    Escape: 27,
    Delete: 8,    
    Up: 38,
    Down: 40
}

export class AutoComplete<T> extends Component implements AutoCompleteProps<T>
{    
    readonly isMultiSelect = false
    readonly suggestionLimit = 10
    readonly isRealtime = true    
    readonly autoFilter = true    
    readonly showNoResultsFound = false
    readonly autoSelectSingleResult = false    
    readonly allowNonSuggestions = false    
    readonly preload = false
    looseMatch = false // // todo - encapsulate further
    readonly suggestor?: (searchText: string) => Promise<string[]>        
    private readonly toModel?: (selection: string | string[]) => void
    private readonly fromModel?: () => string | string[]   
    readonly prefix = ""

    onSelectEvent?: (selection: string | string[]) => void    // // todo - encapsulate further 

    public selections: string[] = [] // todo - encapsulate further   
    protected _searchText?: string 
    protected suggestions: string[] = []

    isSuggestion = false // // todo - encapsulate further
    private attemptedAutoComplete = false
    private enterKeySelection = false
    private transitioningFocus = false    

    @transient readonly target!: Component
    readonly prop!: PropertyRef<T|T[]>

    constructor (props: AutoCompleteProps<T>) {        
        super()        
            
        const target = props.target
        const propKey = getPropertyKey (props.prop)

        Object.keys (props)
            .filter(k => props[k] !== undefined)
            .forEach(k => this[k] = props[k])
        
        this.toModel = async selection => target[propKey] =
            mapSingleOrMultiple (this.isMultiSelect, selection, x => props.labelToModel ? props.labelToModel (x) : x)
        
        this.fromModel = () =>
            mapSingleOrMultiple (this.isMultiSelect, target[propKey], x => props.modelToLabel ? props.modelToLabel (x) : x)        
    }

    get id() {        
        return prefixId (this.prefix, getPropertyKey (this.prop))        
    }
                      
    private handleClickOutside() {
        $(document).click (e => {
            let ac = document.getElementById (this.id)
            if (ac == null)
                return

            if (! ac.parentElement!.contains (e.target) && this.isSuggestionsVisible())
                this.closeSuggestions()
        })        
    }

    async attached (deserialized: boolean)
    {
        this.handleClickOutside()

        if (this.suggestor && this.preload)
            await this.suggestor("")                           
        if (this.fromModel)
            this.setSelection (this.fromModel())
    }
    
    /**
     * You can pass additional properties to the outer div.
     * To customise inner element styles, use css nesting:
     *    "input" for search text box
     *    ".selection" for a selection when isMultiSelect is true
     *    ".dropdown-menu", ".dropdown-item", for suggestions (i.e. the bootstrap classes)
     * e.g. { style: { $nest: {".selection": { backgroundColor: "yellow" } } } }
     */
    view (attrs?: HAttributes) {  
        return div ({ class: "autocomplete " + css.outer + " d-flex align-items-center flex-wrap"}, attrs,
            this.selectionsView(),
            this.searchTextView (),
            this.suggestionsView ()
        )
    }

    private searchTextView () : VElement {
        return (
            inputText ({
                target: this,
                prop: () => this.searchText,
                attrs: {
                    id : this.id,
                    autocomplete: "off",
                    class: css.input,
                    onfocus: () => { $("#"+this.id).parent().addClass ([css.focus, "focus"]) },
                    onblur: () => { $("#"+this.id).parent().removeClass ([css.focus, "focus"]) },
                    onkeyup: e => {
                        if (e.keyCode == KeyCode.Escape)
                            this.closeSuggestions()
                        if (e.keyCode == KeyCode.Enter) {
                            if (this.allowNonSuggestions && ! isNullOrEmpty (this.searchText) && ! this.suggestions.length)
                                this.selectNonSuggestion()
                            else if (this.enterKeySelection)
                                this.enterKeySelection = false
                            else
                                this.autocomplete()
                        }
                        else if (e.keyCode == KeyCode.Down && this.suggestions.length) {
                            $(".dropdown-item").first().focus()
                        }
                    },
                    onkeydown: e => {
                        if (e.keyCode == KeyCode.Delete && isNullOrEmpty (this.searchText)) {                            
                            if (this.selections.length)
                                this.removeSelection (this.selections[this.selections.length-1])
                        }
                    }  
                }
            })
        )
    }

    private selectNonSuggestion() {
        this.update (() => {            
            this.selections = this.selections.concat (this.searchText!)
            this._searchText = ""
            this.onSelect()
            this.focusSearchTextBox()
        })
    }

    get searchText() {
        return this._searchText
    }

    set searchText (value: string|undefined) {    
        if ((this._searchText || "") == (value || ""))
            return        

        this._searchText = value

        this.update (() => {
            if (isNullOrEmpty (value))
                this.attemptedAutoComplete = false            
            if (this.isRealtime)
                this.autocompleteAsync ()
            else {
                this.updateIsSuggestion()
                this.onSelect()
            }
        })
    }

    private updateIsSuggestion() {        
        const match = this.suggestions.filter (s => s.toLowerCase() == (this.searchText || "").toLowerCase())
        this.isSuggestion = match.length > 0                        
        if (this.isSuggestion)
            this.update (() => {
                this._searchText = match[0]   
            })
    }
    
    @debounce (300)    
    private autocompleteAsync () {
        this.autocomplete()
    }

    async autocomplete () {
        if (! this.suggestor)
            return
      
        const search = this.searchText

        if (isNullOrEmpty(search)) {
            this.suggestions = []
            this.update (() => {
                this.attemptedAutoComplete = false
            })
            return
        }
        var suggestions = await this.suggestor (search!)
        
        this.update(() =>
        {            
            if (this.autoFilter) {
                const reg = new RegExp (search!, "i")
                suggestions = suggestions.filter (s => reg.test (s) && this.selections.indexOf (s) == -1)
            }
            
            if (this.autoSelectSingleResult && suggestions.length == 1) {
                this.selectSuggestion (suggestions[0])
                $("#"+this.id).val (this.searchText || "")
                return
            }

            this.suggestions = suggestions.slice (0, this.suggestionLimit)              
            this.attemptedAutoComplete = true
            this.updateIsSuggestion()
            this.onSelect()
        })
    }

    private selectionsView () {
        return (
            ! this.selections.length ? undefined :            
                this.selections.map (sel =>
                    span ({class: css.selection + " selection d-flex align-items-center "},
                        span ({style: {whiteSpace: "nowrap" }}, sel),
                        closeButton ({ onclick: () => this.removeSelection (sel) })
                    )
                )            
        )
    }

    protected onSelect()
    {  
        const selection =
            this.isMultiSelect ?
                this.selections :
                this.isSuggestion || this.looseMatch ? (this.searchText || "") : ""

        if (this.onSelectEvent)
            this.onSelectEvent (selection)

        if (this.toModel)
            this.toModel (selection)
    }

    private removeSelection (sel: string) {
        this.update (() => {
            this.selections = this.selections.filter (s => s != sel)
            this.onSelect()
            this.focusSearchTextBox()
        })
    }

    private focusSearchTextBox() {
        this.onRefreshed(() => $("#" + this.id).focus())
    }

    private closeSuggestions () {
        this.update(() => {
            this.suggestions = []
            this.isSuggestion = false
            this.attemptedAutoComplete = false
            this.focusSearchTextBox()
        })
    }

    private suggestionKeyDown (e: KeyboardEvent)
    {        
        if (e.keyCode == KeyCode.Escape) 
            this.closeSuggestions()
        else if (e.keyCode == KeyCode.Enter) 
            this.enterKeySelection = true                    
        else {
            this.transitioningFocus = true
            if (e.keyCode == KeyCode.Up && e.srcElement!.previousElementSibling)
                (e.srcElement!.previousElementSibling as any).focus()
            else if (e.keyCode == KeyCode.Down && e.srcElement!.nextElementSibling)
                (e.srcElement!.nextElementSibling as any).focus()
        }
    }

    isSuggestionsVisible() {
        return this.attemptedAutoComplete && (this.showNoResultsFound || this.suggestions.length)
    }

    private suggestionsView () {
        return (           
            ! this.isSuggestionsVisible() ? undefined :
            div ({ class:'dropdown-menu', style: { overflowY: "auto", maxHeight: "300px", display: 'block', fontSize: this.suggestionLimit <= 10 ? undefined : '80% '} },
                this.suggestions.length == 0 ?
                    div ({ class: 'text-center'}, "No results found") :
                this.suggestions.map ((s, index) =>
                    commandLink ({
                        onclick: () => this.selectSuggestion (s),
                        onkeydown: e => this.suggestionKeyDown (e),
                        tabindex: 0,                                                        
                        class: 'dropdown-item'
                    }, s)
                )
            )
        )
    }

    private selectSuggestion (suggestion: string) {  
        this.update(() => {
            this._searchText = this.isMultiSelect ? "" : suggestion            
            this.selections = this.isMultiSelect ? this.selections.concat (suggestion) : []
            this.suggestions = []
            this.isSuggestion = true
            this.attemptedAutoComplete = false
            this.focusSearchTextBox()
            this.onSelect()
        })
    }

    setSelection (selection: string | string[])
    {
        this.update (() => {
            if (this.isMultiSelect)
                this.selections = <string[]> selection
            else {
                this._searchText = <string> selection
                this.isSuggestion = true
            }
        })
    }
}

export const mapSingleOrMultiple = <T,U> (isMulti: boolean, value: T | T[], mapping: (val: T) => U) =>
    isMulti ?
        (<T[]>value).map (x => mapping (x)) :
        mapping (<T>value)

export const css = {
    outer: style({           
        border: "1px solid #ced4da",
        borderRadius: "0.25rem",    
        padding: "0.2rem",
        backgroundColor: "white",
        height: "auto",
        minHeight: "calc(2.25rem + 2px)",
        position: "relative"
    }),
    input: style({
        border: "none",
        maxWidth: "99%",    
        flex: "1 1 auto",
        height: "auto",    
        margin: "0 0.25rem",       
        $nest: {
            "&:focus": {
                boxShadow: "none",  
                border: "none !important",
                outlineColor: "white"
            }
        }
    }),
    focus: style ({
        $debugName: "psuedo-focus",
        borderColor: "#80bdff",
        outline: 0,
        boxShadow: "0 0 0 0.2rem rgba(0, 123, 255, 0.25)"                
    }),
    selection: style ({
        border: "1px solid #bec4ca",
        borderRadius: "0.25rem",
        backgroundColor: "rgba(0, 123, 255, 0.25)",
        margin: "0.2rem",    
        padding: "0 0.25rem",
        height: "1.5rem",
        fontSize: "90%"
    })
}