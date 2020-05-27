export default theme => ({
    root: {
        textAlign: `center`,
        border: `${theme.spacing(.25)}px solid ${theme.palette.primary.main}`,
        borderRadius: theme.spacing(.5),
        padding: theme.spacing(4),
    },
    image: {
        maxWidth: `100%`,
        maxHeight: `6rem`,
    },
})