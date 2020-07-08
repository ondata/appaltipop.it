import {
  Grid,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'

import { map } from 'lodash'

import { makeStyles } from '@material-ui/core/styles'
import style from './style'
const useStyles = makeStyles(style)

export default function Index ({
  items = [],
  image
}) {
  const classes = useStyles()

  return (
    <Grid container spacing={4} alignItems='center'>
      <Grid item xs={12} md={8}>
        <List className={classes.root}>
          {map(
            items,
            (item, index) => (
              <ListItem
                key={item.id}
              >
                <ListItemIcon>
                  {index + 1}.
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                />
              </ListItem>
            )
          )}
        </List>
      </Grid>
      <Hidden smDown>
        {
          !!image &&
            <Grid item xs={12} md={4}>
              <img
                src={image}
                alt='Redflag'
                title='Redflag'
                className={classes.image}
              />
            </Grid>
        }
      </Hidden>
    </Grid>
  )
}
