import { includes, startsWith } from 'lodash'

import ReactMarkdown from 'react-markdown'

import {
  Card as MuiCard,
  CardMedia,
  Typography,
  CardActions,
  CardContent,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent
} from '@material-ui/core'

import {
  ArrowForward, Close
} from '@material-ui/icons'

import Link from '../Link'

import { makeStyles } from '@material-ui/core/styles'
import style from './style'
import { useState } from 'react'
const useStyles = makeStyles(style)

export function Button ({
  title = '',
  description = '',
  url = '',
  icon = '',
  noMargins = false
}) {
  const classes = useStyles(noMargins)

  const [open, setOpen] = useState(false)

  function handleOpen (e) {
    setOpen(true)
    e.preventDefault()
  }

  function handleClose (e) {
    setOpen(false)
  }

  function ButtonContent ({ title, description, icon }) {
    return (
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
    )
  }

  if (!url) {
    return (
      <>
        <MuiCard elevation={4} className={classes.button}>
          <a href='#' onClick={handleOpen}>
            <ButtonContent title={title} icon={icon} />
          </a>
        </MuiCard>
        <Dialog fullWidth onClose={handleClose} open={open} className={classes.dialog}>
          <DialogTitle disableTypography>
            <Typography variant='h6'>{title}</Typography>
            <IconButton aria-label='close' onClick={handleClose} className={classes.closeButton}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <ReactMarkdown source={description} />
          </DialogContent>
        </Dialog>
      </>
    )
  } else if (includes(url, '://') || startsWith(url, '//') || startsWith(url, 'mailto:')) {
    return (
      <MuiCard elevation={4} className={classes.button}>
        <a href={url} target='_blank' rel='noopener noreferrer'>
          <ButtonContent title={title} description={description} icon={icon} />
        </a>
      </MuiCard>
    )
  } else {
    return (
      <MuiCard elevation={4} className={classes.button}>
        <Link href={url}>
          <a>
            <ButtonContent title={title} description={description} icon={icon} />
          </a>
        </Link>
      </MuiCard>
    )
  }
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
