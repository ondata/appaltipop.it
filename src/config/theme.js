import { createMuiTheme } from '@material-ui/core/styles'

const primaryColor = `#001442`
const titleFont = `"Montserrat", serif`
const bodyFont = `"PT Serif", serif`

// Create a theme instance.
export default createMuiTheme({
    typography: {
        fontFamily: titleFont,
        body1: {
            fontFamily: bodyFont,
        },
    },
    palette: {
        primary: {
            main: primaryColor,
        },
    },
    overrides: {
        MuiButton: {
            root: {
                textTransform: `none`,
                color: primaryColor,
            },
        },
        MuiMenuItem: {
            root: {
                fontFamily: titleFont,
                color: primaryColor,
            },
        },
        MuiListItemText: {
            primary: {
                fontFamily: titleFont,
                //color: primaryColor,
            },
        },
    },
})
