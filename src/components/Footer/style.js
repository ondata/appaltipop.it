export default theme => ({
    root: {
        backgroundColor: theme.palette.text.primary,
    },
    logo: {
        '& img': {
            width: `80%`,
        },
    },
    menuButton: {
        textDecoration: `underline`,
        '&:hover': {
            textDecoration: `underline`,
        },
    },
})