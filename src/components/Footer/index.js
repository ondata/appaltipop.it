import Link from 'next-translate/Link'

import useTranslation from 'next-translate/useTranslation'

import {
  Container,
  Toolbar,
  AppBar,
  Box,
  List,
  ListItem,
  ListItemText,
  Grid
} from '@material-ui/core'

import { CONTAINER_BREAKPOINT } from '../../config/constants'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index () {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <AppBar component='footer' position='sticky' className={classes.root}>
      <Toolbar>
        <Container
          maxWidth={CONTAINER_BREAKPOINT}
          className={classes.container}
        >
          <Grid container alignItems='flex-start'>
            <Grid
              item
              xs={12}
              sm={6}
              style={{ alignSelf: 'center' }}
            >
              <Box p={2} className={classes.logo}>
                <Link href='/'>
                  <a>
                    <img
                      src='/logo-dark.svg'
                      alt='AppaltiPOP'
                    />
                  </a>
                </Link>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <List className={classes.list}>
                <Link href='/tenders'>
                  <ListItem
                    component='li'
                    button
                    className={classes.menuButton}
                  >
                    <ListItemText
                      primary={t('common:tenders')}
                    />
                  </ListItem>
                </Link>
                <Link href='/download'>
                  <ListItem
                    component='li'
                    button
                    className={classes.menuButton}
                  >
                    <ListItemText
                      primary={t('common:download')}
                    />
                  </ListItem>
                </Link>
              </List>
            </Grid>
            <Grid item xs={6} sm={3}>
              <List className={classes.list}>
                <Link href='/faq'>
                  <ListItem
                    component='li'
                    button
                    className={classes.menuButton}
                  >
                    <ListItemText
                      primary={t('common:faq')}
                    />
                  </ListItem>
                </Link>
                <Link href='/credits'>
                  <ListItem
                    component='li'
                    button
                    className={classes.menuButton}
                  >
                    <ListItemText
                      primary={t('common:credits')}
                    />
                  </ListItem>
                </Link>
              </List>
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  )
}
