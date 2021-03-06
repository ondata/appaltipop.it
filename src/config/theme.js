import { createMuiTheme } from '@material-ui/core/styles'

const baseSpace = 8
const spacing = (d) => d * baseSpace

const greyColor = '#f9f9f9'
const whiteColor = '#ffffff'

const textColor = '#021B44'
const primaryColor = '#3624e0'
const secondaryColor = '#ff0000'

const sansFont = '"Montserrat", sans-serif'
const serifFont = 'Georgia, "PT Serif", serif'

// Create a theme instance.
export default createMuiTheme({
  spacing: baseSpace,
  typography: {
    fontFamily: sansFont,
    h1: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      marginBottom: spacing(4)
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: primaryColor,
      marginTop: spacing(5),
      marginBottom: spacing(2),
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
        lineHeight: 1.5
      }
    },
    body1: {
      fontSize: '1.25rem'
    },
    subtitle1: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: primaryColor,
      marginBottom: spacing(2)
    },
    body2: {
      fontFamily: serifFont,
      fontSize: '1.25rem',
      color: textColor,
      lineHeight: '1.5'
    },
    subtitle2: {
      fontSize: '1.25rem',
      fontWeight: 'bold'
    }
  },
  palette: {
    text: {
      primary: textColor
    },
    primary: {
      main: primaryColor,
      light: '#F3F2FF'
    },
    secondary: {
      main: secondaryColor
    },
    background: {
      default: whiteColor
    },
    grey: {
      100: greyColor
    }
  },
  overrides: {
    MuiDialog: {
      paper: {
        padding: 0
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: greyColor,
        padding: spacing(4)
      },
      rounded: {
        borderRadius: spacing(1)
      }
    },
    MuiPopover: {
      paper: {
        padding: 0
      }
    },
    MuiDrawer: {
      paper: {
        padding: spacing(2)
      }
    },
    MuiAppBar: {
      root: {
        padding: 0
      }
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        textAlign: 'center',
        height: '100%'
      },
      contained: {
        fontWeight: 'bold'
      }
    },
    MuiMenu: {
      paper: {
        padding: 0
      }
    },
    MuiMenuItem: {
      root: {
        fontFamily: sansFont,
        color: primaryColor
      }
    },
    MuiListItemText: {
      primary: {
        fontFamily: sansFont,
        fontWeight: 'bold'
      },
      secondary: {
        fontFamily: sansFont,
        fontSize: '1rem'
      }
    },
    MuiListItemIcon: {
      root: {
        fontFamily: sansFont,
        fontWeight: 'bold',
        fontSize: '1.875rem',
        color: primaryColor
      }
    },
    MuiInputBase: {
      root: {
        backgroundColor: whiteColor
      }
    },
    MuiPagination: {
      ul: {
        justifyContent: 'center'
      }
    },
    MuiAccordion: {
      root: {
        padding: 0,
        '&:before': {
          opacity: 0
        }
      },
      rounded: {
        backgroundColor: whiteColor,
        '& .MuiAccordionSummary-root': {
          border: '2px solid #E7E5FF',
          borderRadius: spacing(2),
          padding: `0 ${spacing(2)}px`
        },
        '& .MuiAccordionDetails-root': {
          backgroundColor: greyColor,
          border: `${spacing(0.5)}px solid ${greyColor}`,
          borderRadius: spacing(2),
          marginTop: spacing(2)
        }
      }
    },
    MuiAccordionSummary: {
      root: {
        padding: 0
      }
    },
    MuiAccordionDetails: {
      root: {
        display: 'block',
        padding: 0
      }
    },
    MuiFormControl: {
      root: {
        width: '100%'
      }
    },
    MuiCard: {
      root: {
        '& a': {
          textDecoration: 'none'
        }
      }
    },
    MuiCardContent: {
      root: {
        '&:last-child': {
          paddingBottom: spacing(2)
        }
      }
    },
    MuiBreadcrumbs: {
      li: {
        fontSize: '1rem'
      }
    },
    MuiSlider: {
      mark: {
        width: 1,
        height: 10,
        marginTop: -4,
        opacity: 0.38
      },
      markActive: {
        width: 1,
        height: 10,
        marginTop: -4,
        opacity: 0.8,
        backgroundColor: primaryColor
      },
      markLabel: {
        fontFamily: sansFont
      }
    }
  }
})
