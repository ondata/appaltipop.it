import useTranslation from 'next-translate/useTranslation'

import { map } from 'lodash'

import {
    Grid, Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index({
    images = [],
    title = "",
    description = "",
}) {

    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12}>
                <Typography variant="subtitle2" color="secondary" gutterBottom className={classes.title}>
                    {title}
                </Typography>
            </Grid>
            {
                map(
                    images,
                    src => (
                        <Grid item xs key={src}>
                            <img src={src} alt="Logo" title="Logo" className={classes.image} />
                        </Grid>
                    )
                )
            }
            <Grid item xs={12}>
                <Typography variant="body1" className={classes.description}>
                    {description}
                </Typography>
            </Grid>
        </Grid>
    )
}
