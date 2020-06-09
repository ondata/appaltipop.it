import { useState } from "react"

import { useRouter } from "next/router"
import Link from "next/link"

import useTranslation from "next-translate/useTranslation"

import clsx from "clsx"

import { includes } from "lodash"

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
    Grid,
} from "@material-ui/core"

import {
    Menu as MenuIcon,
    Language as LanguageIcon,
    Close,
} from "@material-ui/icons"

import { CONTAINER_BREAKPOINT } from "../../config/constants"

import { makeStyles } from "@material-ui/core/styles"

import style from "./style"
const useStyles = makeStyles(style)

export default function Index() {
    const router = useRouter()
    const classes = useStyles()
    const { t, lang } = useTranslation()

    const [isMenuOpen, toggleMenu] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    return (
        <AppBar position="sticky" color="inherit" className={classes.root}>
            <Container
                maxWidth={CONTAINER_BREAKPOINT}
                className={classes.container}
            >
                <Toolbar component="nav">
                    <Box className={classes.logo}>
                        <Link href="/[lang]" as={`/${lang}`}>
                            <a>
                                <img
                                    src="/logo.png"
                                    alt="AppaltiPOP"
                                    title="AppaltiPOP"
                                />
                            </a>
                        </Link>
                    </Box>
                    <Hidden implementation="css" smDown>
                        <Link href="/[lang]/buyers" as={`/${lang}/buyers`}>
                            <Button
                                component="a"
                                className={clsx(
                                    classes.menuButton,
                                    includes(
                                        router.pathname,
                                        "/[lang]/buyer"
                                    ) && classes.selected
                                )}
                            >
                                {t("common:buyers")}
                            </Button>
                        </Link>
                        <Link
                            href="/[lang]/suppliers"
                            as={`/${lang}/suppliers`}
                        >
                            <Button
                                component="a"
                                className={clsx(
                                    classes.menuButton,
                                    includes(
                                        router.pathname,
                                        "/[lang]/supplier"
                                    ) && classes.selected
                                )}
                            >
                                {t("common:suppliers")}
                            </Button>
                        </Link>
                        <Link href="/[lang]/tenders" as={`/${lang}/tenders`}>
                            <Button
                                component="a"
                                className={clsx(
                                    classes.menuButton,
                                    includes(
                                        router.pathname,
                                        "/[lang]/tender"
                                    ) && classes.selected
                                )}
                            >
                                {t("common:tenders")}
                            </Button>
                        </Link>
                        <Link
                            href="/[lang]/get-involved"
                            as={`/${lang}/get-involved`}
                        >
                            <Button
                                component="a"
                                variant="contained"
                                color="primary"
                                disableElevation
                                className={clsx(
                                    classes.menuButton,
                                    router.pathname ===
                                        "/[lang]/get-involved" &&
                                        classes.selected
                                )}
                            >
                                {t("common:get-involved")}
                            </Button>
                        </Link>
                        <Link href="/[lang]/about" as={`/${lang}/about`}>
                            <Button
                                component="a"
                                className={clsx(
                                    classes.menuButton,
                                    router.pathname === "/[lang]/about" &&
                                        classes.selected
                                )}
                            >
                                {t("common:about")}
                            </Button>
                        </Link>
                        <IconButton
                            color="inherit"
                            className={classes.menuButton}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                        >
                            <LanguageIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={!!anchorEl}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem onClick={() => setAnchorEl(null)}>
                                <Link
                                    href={router.route}
                                    as={router.asPath.replace(
                                        `/${lang}`,
                                        "/it"
                                    )}
                                >
                                    <Button
                                        component="a"
                                        className={clsx(
                                            classes.langButton,
                                            lang === "it" && classes.selected
                                        )}
                                    >
                                        {t("common:italian")}
                                    </Button>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={() => setAnchorEl(null)}>
                                <Link
                                    href={router.route}
                                    as={router.asPath.replace(
                                        `/${lang}`,
                                        "/en"
                                    )}
                                >
                                    <Button
                                        component="a"
                                        className={clsx(
                                            classes.langButton,
                                            lang === "en" && classes.selected
                                        )}
                                    >
                                        {t("common:english")}
                                    </Button>
                                </Link>
                            </MenuItem>
                        </Menu>
                    </Hidden>
                    <Hidden implementation="css" mdUp>
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => toggleMenu(!isMenuOpen)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="right"
                            open={isMenuOpen}
                            onClose={() => toggleMenu(false)}
                        >
                            <List component="nav">
                                <Link href="/[lang]" as={`/${lang}`}>
                                    <ListItem component="a" button>
                                        <Grid container alignItems="baseline">
                                            <Grid item xs>
                                                <ListItemIcon
                                                    className={classes.logo}
                                                >
                                                    <img
                                                        src="/logo.png"
                                                        alt="Logo di AppaltiPOP"
                                                        title="AppaltiPOP"
                                                    />
                                                </ListItemIcon>
                                            </Grid>
                                            <Grid item>
                                                <Close
                                                    className={classes.close}
                                                    onClick={() =>
                                                        toggleMenu(false)
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                </Link>
                                <Link
                                    href="/[lang]/buyers"
                                    as={`/${lang}/buyers`}
                                >
                                    <ListItem
                                        component="a"
                                        button
                                        className={clsx(
                                            includes(
                                                router.pathname,
                                                "/[lang]/buyer"
                                            ) && classes.selected
                                        )}
                                    >
                                        <ListItemText
                                            primary={t("common:buyers")}
                                        />
                                    </ListItem>
                                </Link>
                                <Link
                                    href="/[lang]/suppliers"
                                    as={`/${lang}/suppliers`}
                                >
                                    <ListItem
                                        component="a"
                                        button
                                        className={clsx(
                                            includes(
                                                router.pathname,
                                                "/[lang]/supplier"
                                            ) && classes.selected
                                        )}
                                    >
                                        <ListItemText
                                            primary={t("common:suppliers")}
                                        />
                                    </ListItem>
                                </Link>
                                <Link
                                    href="/[lang]/tenders"
                                    as={`/${lang}/tenders`}
                                >
                                    <ListItem
                                        component="a"
                                        button
                                        className={clsx(
                                            includes(
                                                router.pathname,
                                                "/[lang]/tender"
                                            ) && classes.selected
                                        )}
                                    >
                                        <ListItemText
                                            primary={t("common:tenders")}
                                        />
                                    </ListItem>
                                </Link>
                                <Divider />
                                <Link
                                    href="/[lang]/get-involved"
                                    as={`/${lang}/get-involved`}
                                >
                                    <ListItem
                                        component="a"
                                        button
                                        className={clsx(
                                            router.pathname ===
                                                "/[lang]/get-involved" &&
                                                classes.selected
                                        )}
                                    >
                                        <ListItemText
                                            primary={t("common:get-involved")}
                                        />
                                    </ListItem>
                                </Link>
                                <Link
                                    href="/[lang]/about"
                                    as={`/${lang}/about`}
                                >
                                    <ListItem
                                        component="a"
                                        button
                                        className={clsx(
                                            router.pathname ===
                                                "/[lang]/about" &&
                                                classes.selected
                                        )}
                                    >
                                        <ListItemText
                                            primary={t("common:about")}
                                        />
                                    </ListItem>
                                </Link>
                                <Divider />
                                <Link
                                    href={router.route}
                                    as={router.asPath.replace(
                                        `/${lang}`,
                                        "/it"
                                    )}
                                >
                                    <ListItem
                                        component="a"
                                        button
                                        className={clsx(
                                            lang === "it" && classes.selected
                                        )}
                                    >
                                        <ListItemText
                                            primary={t("common:italian")}
                                        />
                                    </ListItem>
                                </Link>
                                <Link
                                    href={router.route}
                                    as={router.asPath.replace(
                                        `/${lang}`,
                                        "/en"
                                    )}
                                >
                                    <ListItem
                                        component="a"
                                        button
                                        className={clsx(
                                            lang === "en" && classes.selected
                                        )}
                                    >
                                        <ListItemText
                                            primary={t("common:english")}
                                        />
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
