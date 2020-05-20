import useTranslation from 'next-translate/useTranslation'

import {
    Grid,
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
        <Grid container direction="column">
            <Grid item>
                <img src="/images/redflag-man.png" alt={t("common:redflag")} title={t("common:redflag")} />
            </Grid>
            <Grid item>
                {flags.length}
            </Grid>
            <Grid item>
                {t("common:redflags")}
            </Grid>
        </Grid>
    )
}
