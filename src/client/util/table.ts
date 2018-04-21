import { Component, table, thead, tr, tbody, td, th } from 'pickle-ts'
import { orderBy } from 'lodash'
import { Exclude } from 'class-transformer'
import { icon } from './util'

export class Table extends Component
{
    headers: any
    data: any[]    
    @Exclude() filter: (row: any) => boolean
    sortKey: string
    sortDirection: boolean

    view() {
        return (
            table ({class: "table"},
                thead (
                    tr (
                        Object.keys (this.headers).map (key =>
                            th (
                                {
                                    style: {cursor : "pointer"},
                                    onclick: () => this.sort (key)
                                },
                                this.headers[key],
                                this.sortKey != key ? null :
                                    icon(this.sortDirection ? "arrow_downward" : "arrow_upward", { style: { transform: "translateY(0.25rem)" } })
                            )
                        )
                    )
                ),
                tbody (
                    this.filteredTable().map (row =>
                        tr (
                            Object.keys (row).map (key =>
                                td (row[key])
                            )
                        )
                    )
                )
            )        
        )
    }

    filteredTable() {     
        var f = this.filter
        return ! f ? this.data : this.data.filter(row => f(row))
    }

    sort (header: string) {
        this.update(() => {
            if (this.sortKey == header)
                this.sortDirection = ! this.sortDirection
            else
                this.sortDirection = true
            this.sortKey = header            
            this.data = orderBy (this.data, header, this.sortDirection ? "asc" : "desc")
        })
    }
}