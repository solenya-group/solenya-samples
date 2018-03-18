import { Component, inputer, div, p } from 'pickle-ts'
import { Type } from 'class-transformer'
import { Modal, ModalAction} from '../util/modal'
import { myButton } from '../util/util'

export class ModalSample extends Component
{
    result = ""
    workingResult = ""
    @Type (() => Modal) modal = new Modal()

    view() {
        return (
            div (
                myButton (() => this.modal.isOpen = true, "open modal"),
                p (this.result),
                ! this.modal.isOpen ? undefined : this.modal.view (
                {
                    body: div (
                        p ("Modals can have input"),
                        p (inputer (() => this.workingResult, e => this.updateProperty(e))),
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