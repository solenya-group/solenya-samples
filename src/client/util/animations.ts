import { VElement, VAttributes, VLifecycle, div } from 'pickle-ts'

type SlideState = {
    a: HTMLElement | SVGElement
    rect: ClientRect
}

export function slide (horizontal = true, forwards = true, duration = 500) : VLifecycle
{    
    return {
        onbeforeupdate (el: Element) {
            const a = el.firstChild as HTMLElement
            el["state_slide"] = <SlideState>{
                a,
                rect : a.getBoundingClientRect()
            }
        },
        onafterupdate (el: Element) {            
            const b = el.firstChild as HTMLElement
            const {a, rect } = el["state_slide"] as SlideState                        
            if (a == b)
                return

            let translate = (n: number) => `translate${horizontal ? "X" : "Y"}(${n}px)`

            let slideAmount = horizontal ?
                (forwards ? rect.width : -b.getBoundingClientRect().width) :
                (forwards ? rect.height : - b.getBoundingClientRect().height);

            el.insertBefore (a, b)
            a.style.position = "absolute"
            a.style.transform = translate (-slideAmount)
            var anim = el["animate"]([{ transform: translate (slideAmount) }, {transform: 'none'}], { duration, easing: 'ease-out' }) 
            a["animate"]([{ opacity: 1 }, { opacity:0 }], { duration, easing: 'ease-out' }) 
            b["animate"]([{ opacity: 0 }, { opacity:1 }], { duration, easing: 'ease-out' }) 
            anim.onfinish = (() => el.removeChild (a))
        }
    }
}

export function slideChildren (): VLifecycle
{
    return {                       
        onbeforeupdate (el: Element) {          
            let els = el["state_slideChildren"] = Array.from(el.childNodes).map(c => (c as HTMLElement))
            els.forEach (c => measure(c))
        },
        onafterupdate (el: Element) {
            let els = el["state_slideChildren"] as HTMLElement[]
            els.forEach (c => flip (c))
        }                    
    }
}

export function measure(el: any) {
    el ["state_flip_rect"] = el.getBoundingClientRect()
}

export function flip (el: any) {            
    var first = el["state_flip_rect"] as ClientRect
    var last = el.getBoundingClientRect()                    
    var invertX = first.left - last.left
    var invertY = first.top - last.top                        
    var player = el["animate"](
        [
            { transform: `translate(${invertX}px,${invertY}px)` },
            { transform: 'none' }
        ],
        { duration: 1000, easing: 'ease-out' }
    )
}