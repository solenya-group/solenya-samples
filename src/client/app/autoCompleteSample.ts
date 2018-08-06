import { Component, div } from 'pickle-ts'
import { Type } from 'class-transformer'
import { AutoComplete } from '../util/autoComplete'

export class AutoCompleteSample extends Component
{
    languages = new AutoComplete()
    
    attached() {
        this.languages.isMultiSelect = true
        this.languages.suggestor = async searchText => languages // for remote/large lists would filter by searchText
    }

    view() {
        return this.languages.view ({class: "form-control"})
    }
}

const languages = [
    "JavaScript",
    "SQL",
    "C#",
    "Java",
    "PHP",
    "Python",
    "TypeScript",
    "C++",
    "Ruby",
    "C",
    "VB.NET",
    "Objective-C",
    "Swift",
    "Go",
    "CoffeeScript",
    "Groovy",
    "Scala",
    "Perl",
    "VBA",
    "R",
    "Visual Basic 6",
    "Assembly",
    "Lua",
    "Matlab",
    "Elixir"
]