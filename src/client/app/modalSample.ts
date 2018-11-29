import { Component, inputText, div, p } from 'pickle-ts'
import { Modal, ModalAction} from '../util/modal'
import { myButton } from '../util/util'

export class ModalSample extends Component
{
    result = ""
    workingResult = ""
    modal = new Modal()

    view() {
        return (
            div (
                myButton ({ onclick: () => this.modal.isOpen = true }, "open modal"),
                p (this.result),
                ! this.modal.isOpen ? undefined : this.modal.view (
                {
                    body: div (
                        p ("Modals can have input"),
                        p (inputText ({component: this, prop: () => this.workingResult })),
                        p ("Also notice that the tab is trapped within the modal.")
                    ),
                    title: "modal test",
                    okText: "OK",
                    cancelText: "Cancel",
                    onClose: (action: ModalAction) => {
                        if (action == ModalAction.OK)
                            this.result = this.workingResult
                        this.workingResult = ""
                        return true
                    }
                })
            )
        )
    }
}