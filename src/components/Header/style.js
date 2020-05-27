export default theme => ({
    logo: {
        flexGrow: 1,
        '& img': {
            height: `3rem`,
            maxWidth: `100%`,
        },
    },
    menuButton: {
        marginLeft: theme.spacing(2),
    },
    langButton: {
        backgroundColor: `transparent`,
        '&:hover': {
            backgroundColor: `transparent`,
        },
    },
})
