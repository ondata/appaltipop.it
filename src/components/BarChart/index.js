import useTranslation from "next-translate/useTranslation"

import { Box, Typography } from "@material-ui/core"

import { makeStyles } from "@material-ui/core/styles"

import style from "./style"
const useStyles = makeStyles(style)

export default function Index({
    title = "",
    description = "",
    inverse = false,
}) {
    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <>
            <Typography variant="subtitle2" className={classes.title}>
                {title}
            </Typography>

            {inverse && (
                <Typography variant="body2" className={classes.description}>
                    {description}
                </Typography>
            )}

            <Box className={classes.chart}></Box>

            {!inverse && (
                <Typography variant="body2" className={classes.description}>
                    {description}
                </Typography>
            )}
        </>
    )
}
