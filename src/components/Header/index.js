import { useState } from 'react'

import { useRouter } from 'next/router'
import Link from '../Link'

import useTranslation from 'next-translate/useTranslation'

import clsx from 'clsx'

import { includes } from 'lodash'

import {
  Container,
  Toolbar,
  IconButton,
  Button,
  AppBar,
  Box,
  Hidden,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Menu,
  MenuItem
} from '@material-ui/core'

import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  Close
} from '@material-ui/icons'

import { CONTAINER_BREAKPOINT } from '../../config/constants'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index () {
  const router = useRouter()
  const classes = useStyles()
  const { t, lang } = useTranslation()

  const [isMenuOpen, toggleMenu] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <AppBar position='sticky' color='inherit' className={classes.root}>
      <Container
        maxWidth={CONTAINER_BREAKPOINT}
        className={classes.container}
      >
        <Toolbar component='nav'>
          <Box className={classes.logo}>
            <Link href='/'>
              <a>
                <img
                  src='/logo.svg'
                  alt='AppaltiPOP'
                  title='AppaltiPOP'
                />
              </a>
            </Link>
          </Box>
          <Hidden implementation='css' smDown>
            <Link href='/tenders' passHref>
              <Button
                className={clsx(
                  classes.menuButton,
                  includes(
                    router.pathname,
                    '/[lang]/tender'
                  ) && classes.selected
                )}
              >
                {t('common:tenders')}
              </Button>
            </Link>
            <Link href='/ocds' passHref>
              <Button
                component='a'
                disableElevation
                className={clsx(
                  classes.menuButton,
                  router.pathname === '/[lang]/ocds' && classes.selected
                )}
              >
                {t('common:ocds')}
              </Button>
            </Link>
            <Link href='/get-involved' passHref>
              <Button
                component='a'
                disableElevation
                className={clsx(
                  classes.menuButton,
                  router.pathname === '/[lang]/get-involved' && classes.selected
                )}
              >
                {t('common:getInvolved')}
              </Button>
            </Link>
            <Link href='/about' passHref>
              <Button
                component='a'
                className={clsx(
                  classes.menuButton,
                  router.pathname === '/[lang]/about' && classes.selected
                )}
              >
                {t('common:about')}
              </Button>
            </Link>
            {/* <IconButton
              color='inherit'
              className={classes.menuButton}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <LanguageIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={!!anchorEl}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>
                <Link
                  href={router.pathname}
                  lang='it'
                  passHref
                >
                  <Button
                    component='a'
                    className={clsx(
                      classes.langButton,
                      lang === 'it' && classes.selected
                    )}
                  >
                    {t('common:italian')}
                  </Button>
                </Link>
              </MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)}>
                <Link
                  href={router.pathname}
                  lang='en'
                  passHref
                >
                  <Button
                    component='a'
                    className={clsx(
                      classes.langButton,
                      lang === 'en' && classes.selected
                    )}
                  >
                    {t('common:english')}
                  </Button>
                </Link>
              </MenuItem>
            </Menu> */}
          </Hidden>
          <Hidden implementation='css' mdUp>
            <IconButton
              edge='end'
              color='inherit'
              aria-label='menu'
              onClick={() => toggleMenu(!isMenuOpen)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor='right'
              open={isMenuOpen}
              onClose={() => toggleMenu(false)}
              className={classes.mobileMenu}
            >
              <IconButton
                className={classes.close}
                color='inherit'
                onClick={() => toggleMenu(false)}
              >
                <Close />
              </IconButton>
              <List component='nav'>
                <Link href='/' passHref>
                  <ListItem
                    component='a'
                    button
                    className={clsx(
                      router.pathname === '/[lang]' && classes.selected
                    )}
                  >
                    <ListItemText
                      primary={t('common:home')}
                    />
                  </ListItem>
                </Link>
                <Link href='/tenders' passHref>
                  <ListItem
                    component='a'
                    button
                    className={clsx(
                      includes(
                        router.pathname,
                        '/[lang]/tender'
                      ) && classes.selected
                    )}
                  >
                    <ListItemText
                      primary={t('common:tenders')}
                    />
                  </ListItem>
                </Link>
                <Link href='/ocds' passHref>
                  <ListItem
                    component='a'
                    button
                    className={clsx(
                      router.pathname === '/[lang]/ocds' && classes.selected
                    )}
                  >
                    <ListItemText
                      primary={t('common:ocds')}
                    />
                  </ListItem>
                </Link>
                <Link href='/get-involved' passHref>
                  <ListItem
                    component='a'
                    button
                    className={clsx(
                      router.pathname === '/[lang]/get-involved' && classes.selected
                    )}
                  >
                    <ListItemText
                      primary={t('common:getInvolved')}
                    />
                  </ListItem>
                </Link>
                <Link href='/about' passHref>
                  <ListItem
                    component='a'
                    button
                    className={clsx(
                      router.pathname === '/[lang]/about' && classes.selected
                    )}
                  >
                    <ListItemText
                      primary={t('common:about')}
                    />
                  </ListItem>
                </Link>
                {/* <Divider />
                <Link
                  href={router.pathname}
                  lang='it'
                >
                  <ListItem
                    component='a'
                    button
                    className={clsx(
                      lang === 'it' && classes.selected
                    )}
                  >
                    <ListItemText
                      primary={t('common:italian')}
                    />
                  </ListItem>
                </Link>
                <Link
                  href={router.pathname}
                  lang='en'
                >
                  <ListItem
                    component='a'
                    button
                    className={clsx(
                      lang === 'en' && classes.selected
                    )}
                  >
                    <ListItemText
                      primary={t('common:english')}
                    />
                  </ListItem>
                </Link> */}
              </List>
            </Drawer>
          </Hidden>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
