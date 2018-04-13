import { style } from 'typestyle'

export const layout = style ({
    display: 'flex',
    flex: '0 1 auto',
    flexFlow:  'column',
    height: '100%'
})

export const layoutHeader = style ({
    flex: '0 1 auto'
})

export const layoutContent = style ({
    flex: '1 1 auto'
})

export const layoutFooter = style ({
    flex: '0 1 auto'
})

export const codeClass = style ({
    fontFamily: 'Courier New',
    padding: '15px'
})