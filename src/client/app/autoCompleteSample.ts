import { Component, div } from 'pickle-ts'
import { Type } from 'class-transformer'
import { AutoComplete } from '../util/autoComplete'

export class AutoCompleteSample extends Component
{
    @Type (() => AutoComplete) languages = new AutoComplete()
    
    constructor () {       
        super()
        this.languages.isMultiSelect = true
        this.languages.suggestor = async searchText => {
            return languages.filter (l => l.indexOf (searchText) != -1)
        }
    }

    view() {
        return this.languages.view()
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