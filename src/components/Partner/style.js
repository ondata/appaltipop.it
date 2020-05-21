export default theme => ({
    root: {
        textAlign: `center`,
        border: `${theme.spacing(.25)}px solid ${theme.palette.secondary.main}`,
        borderRadius: theme.spacing(.5),
        padding: theme.spacing(4),
    },
    image: {
        height: `6rem`,
    },
})