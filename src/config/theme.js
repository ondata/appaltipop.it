import { createMuiTheme } from '@material-ui/core/styles'

const baseSpace = 8
const spacing = d => d*baseSpace

const greyColor = `#f9f9f9`
const whiteColor = `#ffffff`

const textColor = `#021B44`
const primaryColor = `#3624e0`
const secondaryColor = `#ff0000`

const sansFont = `"Montserrat", sans-serif`
const serifFont = `"PT Serif", serif`

// Create a theme instance.
export default createMuiTheme({
    spacing: baseSpace,
    typography: {
        fontFamily: sansFont,
        h1: {
            fontSize: `2.25rem`,
            fontWeight: `bold`,
            marginBottom: spacing(4),
        },
        h2: {
            fontSize: `2.25rem`,
            fontWeight: `bold`,
            color: primaryColor,
            marginBottom: spacing(4),
        },
        body1: {
            fontSize: `1.25rem`,
        },
        subtitle1: {
            fontSize: `1.25rem`,
            fontWeight: `bold`,
            color: primaryColor,
        },
        body2: {
            fontFamily: serifFont,
            fontSize: `1.25rem`,
            color: textColor,
        },
        subtitle2: {
            fontSize: `1.25rem`,
            fontWeight: `bold`,
        }
    },
    palette: {
        text: {
            primary: textColor,
        },
        primary: {
            main: primaryColor,
        },
        secondary: {
            main: secondaryColor,
        },
        background: {
            default: whiteColor,
        },
    },
    overrides: {
        MuiPaper: {
            root: {
                backgroundColor: greyColor,
                padding: spacing(2)
            },
        },
        MuiAppBar: {
            root: {
                padding: 0,
            },
        },
        MuiButton: {
            root: {
                textTransform: `none`,
            },
            contained: {
                fontWeight: `bold`,
            },
        },
        MuiMenu: {
            paper: {
                padding: 0,
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
        MuiPagination: {
            ul: {
                justifyContent: `center`,
            },
        },
    },
})
