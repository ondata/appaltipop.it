import { createMuiTheme } from '@material-ui/core/styles'

const primaryColor = `#021B44`
const secondaryColor = `#3624E0`
const errorColor = `#FF0000`

const sansFont = `"Montserrat", sans-serif`
const serifFont = `"PT Serif", serif`

// Create a theme instance.
export default createMuiTheme({
    typography: {
        fontFamily: sansFont,
        h1: {
            fontSize: `2.25rem`,
            fontWeight: `bold`,
        },
        h2: {
            fontSize: `2.25rem`,
            fontWeight: `bold`,
        },
        body1: {
            fontFamily: serifFont,
            fontSize: `1.25rem`,
        },
        body2: {
            fontSize: `1.25rem`,
        },
        subtitle2: {
            fontSize: `1.25rem`,
            fontWeight: `bold`,
        }
    },
    palette: {
        text: {
            primary: primaryColor,
        },
        primary: {
            main: primaryColor,
        },
        secondary: {
            main: secondaryColor,
        },
        error: {
            main: errorColor,
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
                fontFamily: sansFont,
                color: primaryColor,
            },
        },
        MuiListItemText: {
            primary: {
                fontFamily: sansFont,
                //color: primaryColor,
            },
        },
    },
})
