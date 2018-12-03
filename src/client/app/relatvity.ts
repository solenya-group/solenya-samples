import { Component, div, p, inputRange, IRouted } from 'solenya'
import { style } from 'typestyle'
import { Exclude } from 'class-transformer'

export class Relativity extends Component {
    @Exclude() on = false
    boxes = [-1, 0, 1]
    t = 0
    speedPercent = 50

    speed() { return this.speedPercent / 100 }

    relativeSpeed(x: number, y: number) {
        return (
            x == y ? 0 :
                Math.abs(x - y) == 1 ? this.speed() * (x < y ? -1 : 1) :
                    lorentzAdd(this.speed(), this.speed()) * (x < y ? -1 : 1)
        )
    }

    contraction(x: number, y: number) {
        return contraction(this.relativeSpeed(x, y))
    }

    equationStr() {
        const c = this.speed().toFixed(2) + " c"
        const c2 = lorentzAdd(this.speed(), this.speed()).toFixed(4) + " c"
        return `${c} + ${c} = ${c2}`
    }

    navigated() {
        this.onRefreshed (() => this.simulate())
    }

    view() {
        return (
            div({ style: { textAlign: "center" } },
                p(`You can't go faster than the speed of light - but if Morty is moving relative to Pickle at 70% of the speed of light, and likewise Pickle is moving relative to Rick at 70% speed of light, then what is the relative velocity between Morty and Rick? Use the slider below to visualise what happens. Each row represents what each of the stationary characters sees from their perspective, i.e, from their inertial frame.`),
                inputRange ({target: this, prop: () => this.speedPercent, attrs: {min: 0, max: 99, step: 1, style: { width: "500px" } } }),
                div(this.equationStr()),
                div({ style: { width: '100%' } },
                    div({ style: { position: 'relative', display: 'inline-block' } },
                        this.boxes.map(x =>
                            this.boxes.map(y =>
                                div({ class: sprite(this.character(x)), id: `sprite${x}${y}` }))
                        )
                    )
                )
            )
        )
    }

    character(n: number) {
        return n == -1 ? "morty" : n == 1 ? "rick" : "pickle"
    }

    simulate()
    {
        this.on = (<IRouted><any>this).router.isActive
        if (! this.on)
            return
        
        requestAnimationFrame(() => {
            this.boxes.forEach(x => {
                this.boxes.forEach(y => {
                    var boxSize = document.documentElement.clientWidth / 4
                    var t = this.t / boxSize
                    var v = this.relativeSpeed(x, y)
                    var pos = (boxSize * x) + ((t * v * boxSize / 2) % boxSize / 2)
                    this.setAnimationState(`sprite${x}${y}`, pos - spriteSize, (y + 1) * 180, this.contraction(x, y))

                    this.t++
                })
            })

            this.simulate()
        })
    }

    setAnimationState(sel: string, x: number, y: number, ratio: number) {
        var sprite = document.getElementById(sel) as HTMLElement
        var translate = `translate(${x}px,${y}px)`
        var scale = `scale(${ratio},1)`
        sprite.style.transform = translate + ' ' + scale
    }
}

function lorentz(n: number) {
    return 1 / Math.sqrt(1 - n * n)
}

function contraction(n: number) {
    return Math.sqrt(1 - n * n)
}

function lorentzAdd(u: number, v: number) {
    return (u + v) / (1 + u * v)
}

const spriteSize = 75

const sprite = (name: string) => style({
    padding: `${spriteSize}px`,
    background: `url('/client/images/${name}.png')`,
    backgroundSize: 'cover',
    position: 'absolute'
})