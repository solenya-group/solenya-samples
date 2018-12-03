import { Component, VElement, h2, div, button } from 'solenya'
import $ from 'jquery'

export enum ModalAction
{
    OK = "OK",
    Cancel = "Cancel"
}

export type ModalProperties =
{
    title: string,
    body: VElement,
    okText: string,
    cancelText?: string
    onClose?: (action: ModalAction) => boolean
}

export class Modal extends Component
{
    private _isOpen = false
    private entryFocusId = ""
 
    get isOpen() {return this._isOpen }
    
    set isOpen (value: boolean) {
        if (value)
            this.update(() => {
                this._isOpen = true
                this.entryFocusId = document.activeElement.id
            })
        else
            bootstrapModal (".modal", 'hide')        
    }

    onAttached () {
        
        $(".modal").on("shown.bs.modal", () => {
            trapModalFocus (".modal")
            var firstFocusableEl = $(".modal").find(focusableEls).first()[0]
            setTimeout (() => firstFocusableEl.focus(), 1)
        })

        bootstrapModal (".modal", 'show')

        $(".modal").on('hidden.bs.modal', () => {
            this.update (() =>
                this._isOpen = false
            )
            setTimeout(() => {                
                if (this.entryFocusId)
                    $("#" + this.entryFocusId).focus()
            })
        })
    }

    view (properties?: ModalProperties)
    {       
        if (! properties)
            return div ("modal")

        var onClose = (action: ModalAction) => {
            if (! properties.onClose || properties.onClose (action)) {
                this.isOpen = false
                return true
            }
            return false
        }

        return (
            div ({class: "modal fade"},
            {
                onAttached: el => this.onAttached (),
                role: "dialog"
            }, 
                div ({class:"modal-dialog", role : "document" },
                    div ({class: "modal-content"},
                        div ({class:"modal-header"},
                            h2 ({class: "modal-title"},
                                properties.title
                            )
                        ),            
                        div ({class: "modal-body"},
                            properties.body
                        ),
                        div ({ class: "modal-footer"},
                            ! properties.okText ? undefined :
                                button ({ onclick: () => onClose (ModalAction.OK) }, properties.okText),
                            ! properties.cancelText ? undefined :
                                button ({ onclick: () => onClose (ModalAction.Cancel)}, properties.cancelText)
                        )
                    )
                )
            )
        )
    }
}

function bootstrapModal(sel: string, arg: any) {
    (<any>$(sel)).modal (arg)
}

const focusableEls = 'a, object, :input, iframe, [tabindex]'

function trapModalFocus (element: string) 
{
    $(document).focusin (x => { // if gestures used instead of tab key, do our best to not focus outside modal
        var focused = document.activeElement;
        if ($(element).find (focused).length == 0) {
            var lastFocusableEl = $(element).find(focusableEls).last()[0]
            if (lastFocusableEl && lastFocusableEl.focus)
                lastFocusableEl.focus()
        }
    })

    $(element).on('keydown', e => {
        if (e.key !== 'Tab' && e.keyCode !== 9) // tab
            return
        
        var firstFocusableEl = $(element).find(focusableEls).first()[0]
        var lastFocusableEl = $(element).find(focusableEls).last()[0]

        if (e.shiftKey) {            
            if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus()
                e.preventDefault()
            }
        } else {
            if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus()
                e.preventDefault()
            }
        }
    })
}