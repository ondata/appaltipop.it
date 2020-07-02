import { Box, Typography } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index ({
  title = '',
  description = '',
  inverse = false
}) {
  const classes = useStyles()

  return (
    <>
      <Typography variant='subtitle2' className={classes.title}>
        {title}
      </Typography>

      {inverse && (
        <Typography variant='body2' className={classes.description}>
          {description}
        </Typography>
      )}

      <Box className={classes.chart} />

      {!inverse && (
        <Typography variant='body2' className={classes.description}>
          {description}
        </Typography>
      )}
    </>
  )
}
