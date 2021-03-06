import ReactMarkdown from 'react-markdown'

import { map } from 'lodash'

import { Grid, Typography } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index ({
  images = [],
  title = '',
  description = ''
}) {
  const classes = useStyles()

  return (
    <Grid
      container
      spacing={2}
      alignItems='center'
      className={classes.root}
    >
      <Grid item xs={12}>
        <Typography
          variant='subtitle1'
          gutterBottom
          className={classes.title}
        >
          {title}
        </Typography>
      </Grid>
      {map(images, (src) => (
        <Grid item xs key={src}>
          <img
            src={src}
            alt='Logo'
            title='Logo'
            className={classes.image}
          />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Typography
          component='div'
          variant='body2'
          className={classes.description}
        >
          <ReactMarkdown source={description} />
        </Typography>
      </Grid>
    </Grid>
  )
}
