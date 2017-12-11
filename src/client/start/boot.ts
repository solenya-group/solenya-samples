import 'reflect-metadata'
import { App } from 'pickle-ts'
import { Samples } from '../app/samples'

window["app"] = new App (Samples, "app")