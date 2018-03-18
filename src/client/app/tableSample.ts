import { Component, KeyValue, inputer, div } from 'pickle-ts'
import { Type } from 'class-transformer'
import { Table } from '../util/table'
import { myInput } from '../util/util'

export class TableSample extends Component
{
    filter = ""
    @Type (() => Table) table = new Table()

    constructor() {
        super()
        this.table.headers = electricityCostHeaders
        this.table.data = electricityCostData
    }

    view() {
        return (
            div (
                myInput (() => this.filter, e => this.updateFilter(e)),
                this.table.view ()
            )
        )
    }

    updateFilter (payload: KeyValue) {
        this.update(() => {
            this.updateProperty (payload)
            this.table.filter = row => row.type.toLowerCase().indexOf (this.filter || "") != -1        
        })
    }
}

const electricityCostHeaders = {type: "Generation Type", low: "Low ($/MWh)", high: "High ($/MWh)"}

const electricityCostData =
[
    {type: "Solar PV - Rooftop Residential", low: 187, high:319},
    {type: "Solar PV - Rooftop C&I", low: 85, high: 194},
    {type: "Solar PV - Community", low: 76, high: 150},
    {type: "Solar PV - Crystaline Utility Scale", low: 46, high: 53},
    {type: "Solar PV - Thin Film Utility Scale", low: 43, high: 48},
    {type: "Solar Thermal Tower with Storage", low: 98, high: 181},
    {type: "Fuel Cell", low: 106, high: 167},
    {type: "Microturbine", low: 59, high: 89},
    {type: "Geothermal", low: 77, high: 117},
    {type: "Biomass Direct", low: 55, high: 114},
    {type: "Wind", low: 30, high: 60},
    {type: "Diesel Reciprocating Engine", low: 197, high: 281},
    {type: "Natural Gas Reciprocating Engine", low: 68, high: 106},
    {type: "Gas Peaking", low: 156, high: 210},
    {type: "IGCC", low: 96, high: 231},
    {type: "Nuclear", low: 112, high: 183},
    {type: "Coal", low: 60, high: 143},
    {type: "Gas Combined Cycle", low: 42, high: 78}
]