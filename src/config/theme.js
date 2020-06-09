import { createMuiTheme } from "@material-ui/core/styles"

const baseSpace = 8
const spacing = (d) => d * baseSpace

const greyColor = `#f9f9f9`
const whiteColor = `#ffffff`

const textColor = `#021B44`
const primaryColor = `#3624e0`
const secondaryColor = `#ff0000`

const sansFont = `"Montserrat", sans-serif`
const serifFont = `Georgia, "PT Serif", serif`

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
            "@media (max-width:600px)": {
                fontSize: `1.5rem`,
                lineHeight: 1.5,
            },
        },
        body1: {
            fontSize: `1.125rem`,
        },
        subtitle1: {
            fontSize: `1.25rem`,
            fontWeight: `bold`,
            color: primaryColor,
            marginBottom: spacing(2),
        },
        body2: {
            fontFamily: serifFont,
            fontSize: `1.125rem`,
            color: textColor,
            lineHeight: `1.5`,
        },
        subtitle2: {
            fontSize: `1.25rem`,
            fontWeight: `bold`,
        },
    },
    palette: {
        text: {
            primary: textColor,
        },
        primary: {
            main: primaryColor,
            light: `#F3F2FF`,
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
                padding: spacing(4),
            },
        },
        MuiDrawer: {
            paper: {
                padding: spacing(2),
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
                textAlign: `center`,
                height: `100%`,
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
                //fontWeight: `bold`,
            },
        },
        MuiInputBase: {
            root: {
                backgroundColor: whiteColor,
            },
        },
        MuiPagination: {
            ul: {
                justifyContent: `center`,
            },
        },
        MuiExpansionPanel: {
            root: {
                backgroundColor: whiteColor,
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
        MuiExpansionPanelSummary: {
            root: {
                border: `${spacing(0.5)}px solid #E7E5FF`,
                borderRadius: spacing(2),
                padding: `0 ${spacing(2)}px`,
            },
        },
        MuiExpansionPanelDetails: {
            root: {
                backgroundColor: greyColor,
                border: `${spacing(0.5)}px solid ${greyColor}`,
                borderRadius: spacing(2),
                marginTop: spacing(2),
                padding: `${spacing(4)}px ${spacing(2)}px`,
            },
        },
    },
})
