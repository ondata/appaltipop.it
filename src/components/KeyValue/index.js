import { Typography } from '@material-ui/core'

import Link from '../Link'

import { makeStyles } from '@material-ui/core/styles'
import style from './style'
const useStyles = makeStyles(style)

export default function Index ({
  title = '',
  label = '',
  href = '',
  as = ''
}) {
  const classes = useStyles()

  return (
    <>
      {!!title && <Typography variant='subtitle2' className={classes.title}>{title}</Typography>}

      <Typography variant='body2' className={classes.body}>
        {!!as && !!href ? (
          <Link href={href} as={as}>
            <a>{label || '-'}</a>
          </Link>
        ) : (
          label || '-'
        )}
      </Typography>
    </>
  )
}
