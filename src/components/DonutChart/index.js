import useTranslation from "next-translate/useTranslation"

import { Box, Typography } from "@material-ui/core"

import { makeStyles } from "@material-ui/core/styles"

import style from "./style"
const useStyles = makeStyles(style)

export default function Index({ title = "", description = "" }) {
    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <>
            <Typography variant="subtitle2" className={classes.title}>
                {title}
            </Typography>

            <Box className={classes.chart}></Box>

            <Typography variant="body1" className={classes.description}>
                {description}
            </Typography>
        </>
    )
}
