export default theme => ({
    logo: {
        flexGrow: 1,
        '& img': {
            maxHeight: `2rem`,
            maxWidth: `100%`,
        },
    },
    menuButton: {
        marginLeft: theme.spacing(1),
    },
    langButton: {
        backgroundColor: `transparent`,
        '&:hover': {
            backgroundColor: `transparent`,
        },
    },
})
