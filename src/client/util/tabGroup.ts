import { transient, Component, div, IRouted, li, Router, ul } from 'solenya'
import { slide } from '../util/animations'

export abstract class TabGroup extends Component implements IRouted
{
    @transient router: Router = new Router (this)
    @transient routeName!: string    
    @transient slideForward = false

    attached() {
        for (var k of this.childrenKeys()) {
            this[k].router = new Router (this[k])
            this[k].routeName = k
        }
    }

    async beforeNavigate (childPath: string) {
        const kids = this.childrenKeys()
        if (childPath == '') {
            this.router.navigate (this.router.currentChildComponent ? this.router.currentChildName : kids[0])
            return false
        }

        this.slideForward = kids.indexOf (childPath) > kids.indexOf (this.router.currentChildName)
        return true
    }

    view() {        
        var current = this.router.currentChildComponent!

        return (
            div (
                ul ({ class:'nav nav-tabs'}, this.childrenKeys().map (k =>
                    li ({class: 'nav-item nav-link' + (current.routeName == k ? ' active' : '') },
                        this.router.navigateLink(k, k)
                    )
                )),
                div ({ class: 'tab-content' },
                    this.childrenKeys().map (k =>
                        div ({ class: 'tab-pane' + (current.routeName == k ? ' show active' : '') },
                            div (slide (true, this.slideForward),
                                div ( {key: current.routeName}, current.view())
                            )
                        )
                    )
                )
            )
        )
    }
}