import { useState } from 'react'

import { useRouter } from 'next/router'
import Link from 'next/link'

import useTranslation from 'next-translate/useTranslation'

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
    MenuItem,
    ListItemIcon,
} from '@material-ui/core'

import {
    Menu as MenuIcon,
    Language as LanguageIcon,
} from '@material-ui/icons'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index() {

    const router = useRouter()
    const classes = useStyles()
    const { t, lang } = useTranslation()

    const [ isMenuOpen, toggleMenu ] = useState(false)
    const [ anchorEl, setAnchorEl ] = useState(null)

    return (
        <AppBar position="sticky" color="inherit" className={classes.root}>
            <Container maxWidth="lg" className={classes.container}>
                <Toolbar>
                    <Box className={classes.logo}>
                        <Link href="/[lang]" as={`/${lang}`}>
                            <a><img src="/logo.png" alt="Logo di AppaltiPOP" title="AppaltiPOP" /></a>
                        </Link>
                    </Box>
                    <Hidden implementation="css" smDown>
                        <Link href="/[lang]/buyers" as={`/${lang}/buyers`}>
                            <Button className={classes.menuButton}>{t("common:buyers")}</Button>
                        </Link>
                        <Link href="/[lang]/suppliers" as={`/${lang}/suppliers`}>
                            <Button className={classes.menuButton}>{t("common:suppliers")}</Button>
                        </Link>
                        <Link href="/[lang]/tenders" as={`/${lang}/tenders`}>
                            <Button className={classes.menuButton}>{t("common:tenders")}</Button>
                        </Link>
                        <Link href="/[lang]/get-involved" as={`/${lang}/get-involved`}>
                            <Button className={classes.menuButton}>{t("common:getInvolved")}</Button>
                        </Link>
                        <Link href="/[lang]/about" as={`/${lang}/about`}>
                            <Button className={classes.menuButton}>{t("common:about")}</Button>
                        </Link>
                        <IconButton
                            color="inherit" className={classes.menuButton}
                            onClick={e => setAnchorEl(e.currentTarget)}
                        >
                            <LanguageIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={!!anchorEl}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem onClick={() => setAnchorEl(null)}>
                                <Link href={router.route} as={router.asPath.replace(`/${lang}`,"/it")}>
                                    <Button className={classes.langButton}>{t("common:italian")}</Button>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={() => setAnchorEl(null)}>
                                <Link href={router.route} as={router.asPath.replace(`/${lang}`,"/en")}>
                                    <Button className={classes.langButton}>{t("common:english")}</Button>
                                </Link>
                            </MenuItem>
                        </Menu>
                    </Hidden>
                    <Hidden implementation="css" mdUp>
                        <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => toggleMenu(!isMenuOpen)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer anchor="right" open={isMenuOpen} onClose={() => toggleMenu(false)}>
                            <List>
                                <Link href="/[lang]" as={`/${lang}`}>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <Box className={classes.logo}><img src="/logo.png" alt="Logo di AppaltiPOP" title="AppaltiPOP" /></Box>
                                        </ListItemIcon>
                                    </ListItem>
                                </Link>
                                <Link href="/[lang]/buyers" as={`/${lang}/buyers`}>
                                    <ListItem button>
                                        <ListItemText primary={t("common:buyers")} />
                                    </ListItem>
                                </Link>
                                <Link href="/[lang]/suppliers" as={`/${lang}/suppliers`}>
                                    <ListItem button>
                                        <ListItemText primary={t("common:suppliers")} />
                                    </ListItem>
                                </Link>
                                <Link href="/[lang]/tenders" as={`/${lang}/tenders`}>
                                    <ListItem button>
                                        <ListItemText primary={t("common:tenders")} />
                                    </ListItem>
                                </Link>
                                <Divider />
                                <Link href="/[lang]/get-involved" as={`/${lang}/get-involved`}>
                                    <ListItem button>
                                        <ListItemText primary={t("common:getInvolved")} />
                                    </ListItem>
                                </Link>
                                <Link href="/[lang]/about" as={`/${lang}/about`}>
                                    <ListItem button>
                                        <ListItemText primary={t("common:about")} />
                                    </ListItem>
                                </Link>
                                <Divider />
                                <Link href={router.route} as={router.asPath.replace(`/${lang}`,"/it")}>
                                    <ListItem button>
                                        <ListItemText primary={t("common:italian")} />
                                    </ListItem>
                                </Link>
                                <Link href={router.route} as={router.asPath.replace(`/${lang}`,"/en")}>
                                    <ListItem button>
                                        <ListItemText primary={t("common:english")} />
                                    </ListItem>
                                </Link>
                            </List>
                        </Drawer>
                    </Hidden>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
