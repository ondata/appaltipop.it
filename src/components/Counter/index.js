import { Grid, Typography, IconButton } from '@material-ui/core'

import { HelpOutline } from '@material-ui/icons'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Counter ({
  icon,
  count = 0,
  label = '',
  color = 'inherit',
  url = ''
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
      {!!url && <IconButton color='primary' size='small' className={classes.help}><HelpOutline fontSize='small' /></IconButton>}
    </Grid>
  )
}

export function FlagsCounter ({ count = 0, label = '' }) {
  const classes = useStyles()

  return (
    <Counter
      icon={
        <img
          src='/icons/redflag-man.svg'
          alt='redflag'
          className={classes.icon}
        />
      }
      count={count}
      label={label}
      color={count ? 'secondary' : 'inherit'}
      url='#'
    />
  )
}

export function TendersCounter ({ count = 0, label = '' }) {
  const classes = useStyles()

  return (
    <Counter
      icon={<img src='/icons/lens.svg' alt='' className={classes.icon} />}
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
      icon={<img src='/icons/buyer.svg' alt='' className={classes.icon} />}
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
      icon={<img src='/icons/supplier.svg' alt='' className={classes.icon} />}
      count={count}
      label={label}
      color='primary'
    />
  )
}
