import { VElement, VAttributes, LifecycleListener, lifecycleListener } from 'pickle-ts'
import pose from 'popmotion-pose'

export function slideRight (el: VElement) {
    return openClose ({
        duration:2000,
        initialPose: 'preopen',        
        preopen: { x: '-100%', opacity: 0 },
        open: { x: '0%', opacity: 1},
        close: { x: '100%', opacity: 0 }
    }, el)
}

export function slideInOut(el: VElement) {
    return openClose({
        initialPose: 'close',
        open: { x: '0%' },
        close: { x: '-100%' }
    }, el)
}

export function openClose (props: any, vel: VElement)
{    
    return lifecycleListener (vel, el => {
        const poser = pose (el, props)
        poser.set ('open').then (() => clearTransform (el))
        return {  
            async remove () { 
                await poser.set("close")
                clearTransform (el)
            }   
        }
    })
}

export function slideChildren (vel: VElement) : VElement
{
    return lifecycleListener (vel, el => {        
        return {            
            beforeUpdate () {                
                for (var c of Array.from(el.childNodes) as Element[]) {
                     var poser = c["poser"] = pose(c, {})
                     poser.measure()
                }
            },
            afterUpdate() {
                for (var c of Array.from(el.childNodes) as Element[]) {
                    var poser = c["poser"]
                    if (poser)
                        poser.flip ()                       
                }
            }
        }               
    })   
}

// temporary hack until popmotion-pose clears these automatically
export function clearTransform(el: any) {
    el.style.transform = ''
    el.style.opacity = ''
}