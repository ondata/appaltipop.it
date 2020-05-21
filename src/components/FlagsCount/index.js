import useTranslation from 'next-translate/useTranslation'

import {
    Grid, Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index({
    flags = [],
}) {

    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <Grid container direction="column" className={classes.root}>
            <Grid item>
                <img src="/images/redflag-man.png" alt={t("common:redflag")} title={t("common:redflag")} className={classes.icon} />
            </Grid>
            <Grid item>
                <Typography variant="body2" color={flags.length ? "error" : "inherit"} className={classes.number}>{flags.length}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="subtitle2" className={classes.label}>{t(`common:redflag${flags.length === 1 ? "" : "s"}`)}</Typography>
            </Grid>
        </Grid>
    )
}
