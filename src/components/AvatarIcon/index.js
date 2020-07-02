import { Avatar } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index ({ color = 'primary', children }) {
  const classes = useStyles()

  return <Avatar className={classes[color]}>{children}</Avatar>
}
