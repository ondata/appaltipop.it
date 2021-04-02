import useTranslation from 'next-translate/useTranslation'
import Link from '../Link'

import {
  Container,
  Toolbar,
  AppBar,
  Box,
  List,
  ListItem,
  ListItemText,
  Grid,
  Typography
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
              md={4}
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
            <Grid item xs={6} sm={3} md={2}>
              <List component='nav' className={classes.list}>
                <Link href='/tenders' passHref>
                  <ListItem
                    component='a'
                    button
                    className={classes.menuButton}
                  >
                    <ListItemText
                      primary={t('common:tenders')}
                    />
                  </ListItem>
                </Link>
                <Link href='/download' passHref>
                  <ListItem
                    component='a'
                    button
                    className={classes.menuButton}
                  >
                    <ListItemText
                      primary={t('common:download')}
                    />
                  </ListItem>
                </Link>
                <ListItem
                  component='a'
                  href='/api/v1/'
                  button
                  className={classes.menuButton}
                >
                  <ListItemText
                    primary={t('common:api')}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <List component='nav' className={classes.list}>
                <Link href='/faq' passHref>
                  <ListItem
                    component='a'
                    button
                    className={classes.menuButton}
                  >
                    <ListItemText
                      primary={t('common:faq')}
                    />
                  </ListItem>
                </Link>
                <Link href='/credits' passHref>
                  <ListItem
                    component='a'
                    button
                    className={classes.menuButton}
                  >
                    <ListItemText
                      primary={t('common:credits')}
                    />
                  </ListItem>
                </Link>
                <ListItem
                  component='a'
                  href='https://github.com/ondata/appaltipop.it'
                  target='_blank'
                  button
                  className={classes.menuButton}
                >
                  <ListItemText
                    primary={t('common:sourcecode')}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={4} className={classes.thanks}>
              <Typography gutterBottom>Il presente sito è stato realizzato grazie ad ACT - Anticorruption City Toolkit (ISFP-2017-AG-CORRUPT-823791), un progetto co-finanziato dal Fondo per la Sicurezza interna - Polizia dell'Unione Europea.</Typography>
              <Grid container spacing={2} alignItems='center' justify='center'>
                <Grid item xs={4}>
                  <a href='https://www.anticorruptiontoolkit.eu/' target='_blank' rel='noreferrer'>
                    <img
                      src='/partners/act.png'
                      alt='ACT'
                    />
                  </a>
                </Grid>
                <Grid item xs={4}>
                  <a href='https://ec.europa.eu/' target='_blank' rel='noreferrer'>
                    <img
                      src='/partners/commissione-europea.png'
                      alt='Commissione europea'
                    />
                  </a>
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  )
}
