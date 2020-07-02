import Link from 'next-translate/Link'

import {
  Card as MuiCard,
  CardMedia,
  Typography,
  CardActions,
  CardContent,
  IconButton,
  Grid
} from '@material-ui/core'

import {
  ArrowForward
} from '@material-ui/icons'

import { makeStyles } from '@material-ui/core/styles'
import style from './style'
const useStyles = makeStyles(style)

export function Button ({
  title = '',
  url = '',
  icon = ''
}) {
  const classes = useStyles()

  return (
    <MuiCard elevation={4} className={classes.button}>
      <Link href={url}>
        <Grid container alignItems='center'>
          <Grid item>
            <CardMedia image={icon} className={classes.icon} />
          </Grid>
          <Grid item xs>
            <CardContent>
              <Typography variant='body1' color='textSecondary' className={classes.buttonTitle}>{title}</Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Link>
    </MuiCard>
  )
}

export function Card ({
  title = '',
  description = '',
  url = '',
  icon = ''
}) {
  const classes = useStyles()

  return (
    <MuiCard elevation={4} className={classes.card}>
      <Grid container alignItems='center'>
        <Grid item>
          <CardMedia image={icon} className={classes.icon} />
        </Grid>
        <Grid item xs>
          <CardContent>
            <Typography variant='body1' color='textPrimary' className={classes.cardTitle}>{title}</Typography>
            <Typography variant='body1' color='textSecondary' className={classes.description}>{description}</Typography>
          </CardContent>
        </Grid>
        <Grid item style={{ alignSelf: 'flex-end' }}>
          <CardActions disableSpacing>
            <Link href={url}>
              <IconButton href={url} color='primary' className={classes.iconButton}><ArrowForward /></IconButton>
            </Link>
          </CardActions>
        </Grid>
      </Grid>
    </MuiCard>
  )
}
