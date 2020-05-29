import Link from 'next/link'

import useTranslation from 'next-translate/useTranslation'

import {
    Container,
    Toolbar,
    AppBar,
    Box,
    List,
    ListItem,
    ListItemText,
    Grid,
    Hidden,
} from '@material-ui/core'

import { CONTAINER_BREAKPOINT } from '../../config/constants'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index() {

    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <AppBar component="footer" position="sticky" className={classes.root}>
            <Toolbar>
                <Container maxWidth={CONTAINER_BREAKPOINT} className={classes.container}>
                    <Grid container spacing={2} alignItems="flex-start">
                        <Grid item xs={12} md={6} style={{alignSelf:"center"}}>
                            <Box p={2} className={classes.logo}>
                                <Link href="/[lang]" as={`/${lang}`}>
                                    <a><img src="/logo-dark.png" alt="Logo di AppaltiPOP" title="AppaltiPOP" /></a>
                                </Link>
                            </Box>
                        </Grid>
                        <Hidden smDown>
                            <Grid item md={3}>
                                <List>
                                    <Link href="/[lang]/buyers" as={`/${lang}/buyers`}>
                                        <ListItem component="li" button className={classes.menuButton}>
                                            <ListItemText primary={t("common:buyers")} />
                                        </ListItem>
                                    </Link>
                                    <Link href="/[lang]/suppliers" as={`/${lang}/suppliers`}>
                                        <ListItem component="li" button className={classes.menuButton}>
                                            <ListItemText primary={t("common:suppliers")} />
                                        </ListItem>
                                    </Link>
                                    <Link href="/[lang]/tenders" as={`/${lang}/tenders`}>
                                        <ListItem component="li" button className={classes.menuButton}>
                                            <ListItemText primary={t("common:tenders")} />
                                        </ListItem>
                                    </Link>
                                </List>
                            </Grid>
                        </Hidden>
                        <Hidden smDown>
                            <Grid item md={3}>
                                <List>
                                    <Link href="/[lang]/get-involved" as={`/${lang}/get-involved`}>
                                        <ListItem component="li" button className={classes.menuButton}>
                                            <ListItemText primary={t("common:get-involved")} />
                                        </ListItem>
                                    </Link>
                                    <Link href="/[lang]/faq" as={`/${lang}/faq`}>
                                        <ListItem component="li" button className={classes.menuButton}>
                                            <ListItemText primary={t("common:faq")} />
                                        </ListItem>
                                    </Link>
                                    <Link href="/[lang]/credits" as={`/${lang}/credits`}>
                                        <ListItem component="li" button className={classes.menuButton}>
                                            <ListItemText primary={t("common:credits")} />
                                        </ListItem>
                                    </Link>
                                </List>
                            </Grid>
                        </Hidden>
                        <Hidden mdUp>
                            <Grid item xs={12}>
                                <List>
                                    <Link href="/[lang]/faq" as={`/${lang}/faq`}>
                                        <ListItem component="li" button className={classes.menuButton}>
                                            <ListItemText primary={t("common:faq")} />
                                        </ListItem>
                                    </Link>
                                    <Link href="/[lang]/credits" as={`/${lang}/credits`}>
                                        <ListItem component="li" button className={classes.menuButton}>
                                            <ListItemText primary={t("common:credits")} />
                                        </ListItem>
                                    </Link>
                                </List>
                            </Grid>
                        </Hidden>
                    </Grid>
                </Container>
            </Toolbar>
        </AppBar>
    )
}
