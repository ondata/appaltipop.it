export default (theme) => ({
    container: {
        padding: 0,
    },
    logo: {
        flexGrow: 1,
        "& img": {
            maxHeight: `2rem`,
            maxWidth: `100%`,
        },
    },
    menuButton: {
        marginLeft: theme.spacing(1),
    },
    langButton: {
        backgroundColor: `transparent`,
        "&:hover": {
            backgroundColor: `transparent`,
        },
    },
    selected: {
        textDecoration: `underline`,
    },
})
