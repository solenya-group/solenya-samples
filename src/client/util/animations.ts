import { VElement, VAttributes, LifecycleListener, lifecycleListener } from 'pickle-ts'
import pose, { Poser } from 'popmotion-pose'

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
        var posers: Poser[]
        return {            
            beforeUpdate () {                
                posers = Array.from (el.childNodes).map (c => pose (c as Element, {}))
                posers.forEach (p => p.measure())
            },
            afterUpdate() {
                posers.forEach (p => p.flip())
            }
        }               
    })   
}

// temporary hack until popmotion-pose clears these automatically
export function clearTransform(el: any) {
    el.style.transform = ''
    el.style.opacity = ''
}