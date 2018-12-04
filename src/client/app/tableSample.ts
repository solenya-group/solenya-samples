import { plainToClass, Type } from 'class-transformer'
import { uniqBy } from 'lodash-es'
import { transient, br, Component, div } from 'solenya'
import { style } from 'typestyle'
import { Table } from '../util/table'

export class TableSample extends Component
{
    @transient table = new PresidentTable (10)

    view() {
        var o = new President()
        return (
            div (
                this.table.searchInput (),
                br(),
                this.table.view ({css: tableStyle, guideObject: o, columns:
                [
                    { property: () => o.name, canSort: true },
                    { property: () => o.party, canSort: true, options: parties.map(p => ({label: p.party, value: "is:"+p.party })) },                    
                    { property: () => o.date, display: p => "" + p.date.getFullYear(), label: "Inaugurated", canSort: true },
                    { property: () => o.age, label: "Age Inaugurated", canSort: true }
                ]})
            )
        )
    }     
}

class PresidentTable extends Table<President>
{
    @Type (() => President) results?: President[]

    attached() {
        this.reload()
    }   

    // use this.loadFromUrl for server based queries    
    async reload ()
    {        
        let rows = plainToClass (President, presidents)        
        this.loadFromArray (rows, r => r.filter (this.search))
    }
}

class President extends Component
{    
    @Type(() => Date) date!: Date
    name = ""
    party = ""    
    age = NaN    

    // typically would occur on server
    filter (search?: string)
    {
        if (! search)
            return true

        if (search.startsWith ("is:"))
            return this.party == search.substring ("is:".length)

        const reg = new RegExp (search, "i")
        return reg.test (this.name)
    }
}

const presidents =
[
    { name: "Donald J. Trump", party: "Republican", age:70, date: "2017/01/20" },
    { name: "Barack Obama", party: "Democratic", age:47, date: "2009/01/20" },
    { name: "George W. Bush", party: "Republican", age:45, date: "2001/01/20" },
    { name: "Bill Clinton", party: "Democratic", age:46, date: "1993/01/20" },
    { name: "George H.W. Bush", party: "Republican", age:64, date: "1989/01/20" },
    { name: "Ronald Reagan", party: "Republican", age:69, date: "1981/01/20" },
    { name: "James Earl Carter", party: "Democratic", age:52, date: "1977/01/20" },
    { name: "Gerald R. Ford", party: "Republican", age:61, date: "1974/08/09" },
    { name: "Richard M. Nixon", party: "Republican", age:56, date: "1969/01/20" },
    { name: "Lyndon B. Johnson", party: "Democratic", age:55, date: "1963/11/22" },
    { name: "John F. Kennedy", party: "Democratic", age:43, date: "1961/01/20" },
    { name: "Dwight D. Eisenhower", party: "Republican", age:62, date: "1953/01/20" },
    { name: "Harry S. Truman", party: "Democratic", age:60, date: "1945/04/12" },
    { name: "Franklin D. Roosevelt", party: "Democratic", age:51, date: "1933/03/04" },
    { name: "Herbert Hoover", party: "Republican", age:54, date: "1929/03/04" },
    { name: "Calvin Coolidge", party: "Republican", age:51, date: "1923/08/02" },
    { name: "Warren Harding", party: "Republican", age:55, date: "1921/03/04" },
    { name: "Woodrow Wilson", party: "Democratic", age:56, date: "1913/03/04" },
    { name: "William Howard Taft", party: "Republican", age:51, date: "1909/03/04" },
    { name: "Theodore Roosevelt", party: "Republican", age:32, date: "1901/09/14" },
    { name: "William McKinley", party: "Republican", age:54, date: "1897/03/04" },
    { name: "Grover Cleveland", party: "Democratic", age:55, date: "1893/03/04" },
    { name: "Benjamin Harrison", party: "Republican", age:55, date: "1889/03/04" },
    { name: "Grover Cleveland", party: "Democratic", age:47, date: "1885/03/04" },
    { name: "Chester A. Arthur", party: "Republican", age:51, date: "1881/09/19" },
    { name: "James A. Garfield", party: "Republican", age:49, date: "1881/03/04" },
    { name: "Rutherford B. Hayes", party: "Republican", age:54, date: "1877/03/04" },
    { name: "Ulysses S. Grant", party: "Republican", age:46, date: "1869/03/04" },
    { name: "Andrew Johnson", party: "National Union (D)", age:56, date: "1865/04/15" },
    { name: "Abraham Lincoln", party: "National Union (R)", age:52, date: "1861/03/04" },
    { name: "James Buchanan", party: "Democratic", age:55, date: "1857/03/04" },
    { name: "Franklin Pierce", party: "Democratic", age:48, date: "1853/03/04" },
    { name: "Millard Fillmore", party: "Whig", age:50, date: "1850/07/09" },
    { name: "Zachary Taylor", party: "Whig", age:64, date: "1849/03/04" },
    { name: "James Polk", party: "Democratic", age:49, date: "1845/03/04" },
    { name: "John Tyler", party: "Whig", age:51, date: "1841/04/04" },
    { name: "William Henry Harrison", party: "Whig", age:68, date: "1841/03/04" },
    { name: "Martin Van Buren", party: "Democratic", age:54, date: "1837/03/04" },
    { name: "Andrew Jackson", party: "Democratic", age:61, date: "1829/03/04" },
    { name: "John Quincy Adams", party: "Nat-Rep", age:57, date: "1825/03/04" },
    { name: "James Monroe", party: "Democratic-Rep", age:58, date: "1817/03/04" },
    { name: "James Madison", party: "Democratic-Rep", age:57, date: "1809/03/04" },
    { name: "Thomas Jefferson", party: "Democratic-Rep", age:57, date: "1801/03/04" },
    { name: "John Adams", party: "Federalist", age:61, date: "1797/03/04" },
    { name: "George Washington", party: "Unaffiliated", age:57, date: "1789/03/04" }
]

const parties = uniqBy (presidents, p => p.party)

export const tableStyle = style({
    $nest: {
        th: {
            paddingBottom: "0.75rem"
        },
        tr: {            
            borderBottom: '1px solid #ccc',
            td: {
                verticalAlign: "middle",
                padding: '0.5rem 1rem 0.5rem 0'
            }
        }
    }
})