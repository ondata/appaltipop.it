import { Box, Typography } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index ({ title = '', description = '' }) {
  const classes = useStyles()

  return (
    <>
      <Typography variant='subtitle2' className={classes.title}>
        {title}
      </Typography>

      <Box className={classes.chart} />

      <Typography variant='body1' className={classes.description}>
        {description}
      </Typography>
    </>
  )
}
