import useTranslation from 'next-translate/useTranslation'

import {
    Grid, Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Counter({
    icon,
    count = 0,
    label = "",
    color = "inherit"
}) {

    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <Grid container direction="column" className={classes.root}>
            <Grid item>
                {icon}
            </Grid>
            <Grid item>
                <Typography variant="body1" color={color} className={classes.number}>{count}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="subtitle2" className={classes.label}>{label}</Typography>
            </Grid>
        </Grid>
    )
}

export function FlagsCounter({
    count = 0,
    label = "",
}) {

    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <Counter
            icon={<img src="/images/redflag-man.png" alt={t("common:redflag")} title={t("common:redflag")} className={classes.icon} />}
            count={count}
            label={label}
            color={count ? "secondary" : "primary"}
        />
    )

}

export function TendersCounter({
    count = 0,
    label = "",
}) {

    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <Counter
            icon={<img src="/images/tender-lens.png" alt={t("common:tender")} title={t("common:tender")} className={classes.icon} />}
            count={count}
            label={label}
            color="primary"
        />
    )

}

export function BuyersCounter({
    count = 0,
    label = "",
}) {

    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <Counter
            icon={<img src="/images/tender-lens.png" alt={t("common:buyer")} title={t("common:buyer")} className={classes.icon} />}
            count={count}
            label={label}
            color="primary"
        />
    )

}

export function SuppliersCounter({
    count = 0,
    label = "",
}) {

    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <Counter
            icon={<img src="/images/tender-lens.png" alt={t("common:supplier")} title={t("common:supplier")} className={classes.icon} />}
            count={count}
            label={label}
            color="primary"
        />
    )

}
