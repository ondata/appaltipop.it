import { Grid, Typography, IconButton } from '@material-ui/core'

import { HelpOutline } from '@material-ui/icons'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Counter ({
  icon,
  count = 0,
  label = '',
  color = 'inherit'
}) {
  const classes = useStyles()

  return (
    <Grid container direction='column' className={classes.root}>
      <Grid item>{icon}</Grid>
      <Grid item>
        <Typography
          variant='body1'
          color={color}
          className={classes.number}
        >
          {count}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant='subtitle2' className={classes.label}>
          {label}
        </Typography>
      </Grid>
      <IconButton color='primary' size='small' className={classes.help}><HelpOutline fontSize='small' /></IconButton>
    </Grid>
  )
}

export function FlagsCounter ({ count = 0, label = '' }) {
  const classes = useStyles()

  return (
    <Counter
      icon={
        <img
          src='/icons/redflag-man.png'
          alt='redflag'
          className={classes.icon}
        />
      }
      count={count}
      label={label}
      color={count ? 'secondary' : 'inherit'}
    />
  )
}

export function TendersCounter ({ count = 0, label = '' }) {
  const classes = useStyles()

  return (
    <Counter
      icon={<img src='/icons/lens.png' alt='' className={classes.icon} />}
      count={count}
      label={label}
      color='primary'
    />
  )
}

export function BuyersCounter ({ count = 0, label = '' }) {
  const classes = useStyles()

  return (
    <Counter
      icon={<img src='/icons/lens.png' alt='' className={classes.icon} />}
      count={count}
      label={label}
      color='primary'
    />
  )
}

export function SuppliersCounter ({ count = 0, label = '' }) {
  const classes = useStyles()

  return (
    <Counter
      icon={<img src='/icons/lens.png' alt='' className={classes.icon} />}
      count={count}
      label={label}
      color='primary'
    />
  )
}
