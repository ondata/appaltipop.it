export default (theme) => ({
    root: {
        backgroundColor: theme.palette.text.primary,
    },
    logo: {
        "& img": {
            maxWidth: `50%`,
            [theme.breakpoints.down("sm")]: {
                maxWidth: `100%`,
            },
        },
    },
    menuButton: {
        textDecoration: `underline`,
        "&:hover": {
            textDecoration: `underline`,
        },
    },
})
