import { includes, startsWith } from 'lodash'

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

import Link from '../Link'

import { makeStyles } from '@material-ui/core/styles'
import style from './style'
const useStyles = makeStyles(style)

export function Button ({
  title = '',
  description = '',
  url = '',
  icon = '',
  noMargins = false
}) {
  const classes = useStyles(noMargins)

  return (
    <MuiCard elevation={4} className={classes.button}>
      {
        includes(url, '://') || startsWith(url, '//') || startsWith(url, 'mailto:')
          ? (
            <a href={url} target='_blank' rel='noopener noreferrer'>
              <Grid container alignItems='center'>
                <Grid item>
                  <CardMedia image={icon} className={classes.icon} />
                </Grid>
                <Grid item xs>
                  <CardContent>
                    <Typography variant='body1' color='textPrimary' className={description ? classes.cardTitle : classes.buttonTitle}>{title}</Typography>
                    {!!description && <Typography variant='body1' color='textSecondary' className={classes.description}>{description}</Typography>}
                  </CardContent>
                </Grid>
              </Grid>
            </a>
          ) : (
            <Link href={url}>
              <a>
                <Grid container alignItems='center'>
                  <Grid item>
                    <CardMedia image={icon} className={classes.icon} />
                  </Grid>
                  <Grid item xs>
                    <CardContent>
                      <Typography variant='body1' color='textPrimary' className={description ? classes.cardTitle : classes.buttonTitle}>{title}</Typography>
                      {!!description && <Typography variant='body1' color='textSecondary' className={classes.description}>{description}</Typography>}
                    </CardContent>
                  </Grid>
                </Grid>
              </a>
            </Link>
          )
      }
    </MuiCard>
  )
}

export function Card ({
  title = '',
  description = '',
  url = '',
  icon = '',
  noMargins = false
}) {
  const classes = useStyles(noMargins)

  return (
    <MuiCard elevation={4} className={classes.card}>
      <Grid container alignItems='center'>
        <Grid item>
          <CardMedia image={icon} className={classes.icon} />
        </Grid>
        <Grid item xs>
          <CardContent>
            <Typography variant='body1' color='textPrimary' className={classes.cardTitle}>{title}</Typography>
            {!!description && <Typography variant='body1' color='textSecondary' className={classes.description}>{description}</Typography>}
          </CardContent>
        </Grid>
        <Grid item style={{ alignSelf: 'flex-end' }}>
          <CardActions disableSpacing>
            {
              includes(url, '://')
                ? (
                  <IconButton component='a' href={url} color='primary' className={classes.iconButton}><ArrowForward /></IconButton>
                ) : (
                  <Link href={url} passHref>
                    <IconButton component='a' color='primary' className={classes.iconButton}><ArrowForward /></IconButton>
                  </Link>
                )
            }
          </CardActions>
        </Grid>
      </Grid>
    </MuiCard>
  )
}
