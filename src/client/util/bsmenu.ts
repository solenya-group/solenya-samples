import { a, commandLink, div, span, VElement } from "pickle-ts"

export type MenuItem = {
    label: string | VElement,
    action?: () => void
}

export const menuView = (lbl: string, selected: boolean, ...items: MenuItem[]) =>
    div ({class: "dropdown"},
        a ({
            class: 'dropdown-toggle d-flex align-items-center mr-2',
            "data-toggle": "dropdown",
            style: {
                cursor: 'pointer',
                $nest : {
                    "&::after": {
                        color: selected ? "orange": undefined
                    }
                }
            }
        },    
            lbl,
        ),
        div ({ class: 'dropdown-menu'},
            items.map (i => 
                ! i.action ? div ({class: "dropdown-divider"}) :
                commandLink ({ onclick: i.action, class: "dropdown-item"}, i.label)
            )
        )
    )