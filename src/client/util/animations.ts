import { VElement, VAttributes, VLifecycle, div } from 'pickle-ts'
import { Exclude } from 'class-transformer'

type SlideState = {
    a: HTMLElement | SVGElement
    aRect: ClientRect
    scrollX: number
    scrollY: number
}

export function slide (horizontal = true, forwards = true, duration = 1000, adjustScroll = false) : VLifecycle
{    
    return {
        onBeforeUpdate (el)
        {
            const a = el.firstChild as HTMLElement
            el["state_slide"] = <SlideState>{
                a,                
                aRect : a.getBoundingClientRect(),
                scrollX : window.scrollX,
                scrollY: window.scrollY
            }            
        },
        onUpdated (el)
        {                         
            const b = el.firstChild as HTMLElement
            const {a, aRect, scrollX, scrollY } = el["state_slide"] as SlideState                        
            if (a == b)
                return
                                   
            let bRect = b.getBoundingClientRect()

            let slideAmount = horizontal ?
                (forwards ? -aRect.width : bRect.width) :
                (forwards ? -aRect.height : bRect.height)
            
            var scrollAdjust = 0
            if (adjustScroll && forwards) {
                scrollAdjust = Math.abs(horizontal ? Math.min(0, aRect.left) : Math.min(0, aRect.top))
                slideAmount += scrollAdjust
            }
            
            el.insertBefore (a, null) 
            a.style.position = "absolute"
            a.style.left = a.style.top = "0px"
            a.style.width = "" + aRect.width + "px"
            a.style.height = "" + aRect.height + "px"            
            a.style.transform = getTranslate (slideAmount - scrollAdjust, horizontal)
            a.style.opacity = '0'

            if (adjustScroll)
                window.scrollTo (0,0)

            var anim = el["animate"]([{transform: getTranslate(-slideAmount, horizontal)}, { transform: 'none' }], { duration, easing: 'ease-out' }) 
            
            a["animate"]([{ opacity: 1 }, { opacity:0 }], { duration, easing: 'ease-out' }) 
            b["animate"]([{ opacity: 0 }, { opacity:1 }], { duration, easing: 'ease-out' }) 
            
            anim.onfinish = (() =>
            {                                  
                el.removeChild (a)                           
            })
        }
    }
}

export function slideChildren (): VLifecycle
{
    return {                       
        onBeforeUpdate (el) {          
            let els = el["state_slideChildren"] = Array.from(el.childNodes).map(c => (c as HTMLElement))
            els.forEach (c => measure(c))
        },
        onUpdated (el) {
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

export function getTranslate (n: number, horizontal: boolean) {
    return `translate${horizontal ? "X" : "Y"}(${n}px)`
}