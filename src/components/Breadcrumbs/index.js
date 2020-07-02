import Link from 'next-translate/Link'

import { map } from 'lodash'

import {
  Breadcrumbs
} from '@material-ui/core'

import {
  NavigateNext
} from '@material-ui/icons'

import { makeStyles } from '@material-ui/core/styles'
import style from './style'
const useStyles = makeStyles(style)

export default function Index ({
  items = []
}) {
  const classes = useStyles()

  return (
    <Breadcrumbs
      className={classes.root}
      separator={<NavigateNext fontSize='small' />}
      aria-label='breadcrumb'
    >
      {
        map(
          items,
          item => (
            item.url ? (
              <Link key={item.label} href={item.url}>
                <a className={classes.item}>{item.label}</a>
              </Link>
            ) : (
              <span key={item.label} className={classes.item}>
                {item.label}
              </span>
            )
          )
        )
      }
    </Breadcrumbs>
  )
}
