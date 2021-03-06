import './css/site.scss'
import './polyfills'
import 'bootstrap'
import { App } from 'solenya'
import { Samples } from './app/samples'

window["app"] = new App (Samples, "app")

module.hot.accept('../client/app/samples', () => {
    var latest = require ('../client/app/samples')
    window["app"] = new App (latest.Samples.prototype.constructor, "app", {isVdomRendered: true})
})