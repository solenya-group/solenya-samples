import { Component } from 'pickle-ts'

export abstract class Cursor extends Component
{
    activeIndex = 0
    prevIndex = 0

    abstract childKeys() : string[]

    currentName () {
        return this.name (this.activeIndex)
    }
    
    isFirstPage () {
        return this.activeIndex === 0
    }    

    isLastPage () {
        return this.activeIndex === this.length() - 1
    }

    updateIndex (newIndex: number) {
        if (newIndex == this.activeIndex)
            return
        return this.update(() => {            
            this.prevIndex = this.activeIndex
            this.activeIndex = newIndex
        })
    }
  
    prev() {
        return this.updateIndex (this.activeIndex - 1)
    }

    next() {
        return this.updateIndex (this.activeIndex + 1)
    }
    
    current() {
        return this.item (this.name (this.activeIndex))
    }

    name (index: number) {
        return this.childKeys()[index]
    }

    index(name: string) {
        return (
            name == "" || name == null ? 0 :
            this.childKeys().findIndex (s => new RegExp (name, "i").test (s))
        )
    }

    length() {
        return this.childKeys().length
    }

    item (name: string) {
        return this[name]
    }
}