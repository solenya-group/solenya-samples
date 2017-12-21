import '../css/site.scss'
import './polyfills'
import 'bootstrap'
import { App } from 'pickle-ts'
import { Samples } from '../app/samples'

window["app"] = new App (Samples, "app")  

if (module.hot)
    module.hot.accept('../app/samples', () => { location.reload() })