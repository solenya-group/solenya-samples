import './polyfills'
import { App } from 'pickle-ts'
import { Samples } from '../app/samples'

window["app"] = new App (Samples, "app", true)

module.hot.accept('../app/samples', () => { location.reload() })