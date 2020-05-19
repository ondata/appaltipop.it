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
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index() {

    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <AppBar position="sticky" color="primary" className={classes.root}>
            <Toolbar>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container alignItems="center">
                        <Grid item md={6}>
                            <Box className={classes.logo}>
                                <Link href="/[lang]" as={`/${lang}`}>
                                    <a><img src="/logo-dark.png" alt="Logo di AppaltiPOP" title="AppaltiPOP" /></a>
                                </Link>
                            </Box>
                        </Grid>
                        <Grid item md={3}>
                            <List>
                                <Link href="/[lang]/buyers" as={`/${lang}/buyers`}>
                                    <ListItem button className={classes.menuButton}>
                                        <ListItemText primary={t("common:buyers")} />
                                    </ListItem>
                                </Link>
                                <Link href="/[lang]/suppliers" as={`/${lang}/suppliers`}>
                                    <ListItem button className={classes.menuButton}>
                                        <ListItemText primary={t("common:suppliers")} />
                                    </ListItem>
                                </Link>
                                <Link href="/[lang]/tenders" as={`/${lang}/tenders`}>
                                    <ListItem button className={classes.menuButton}>
                                        <ListItemText primary={t("common:tenders")} />
                                    </ListItem>
                                </Link>
                            </List>
                        </Grid>
                        <Grid item md={3}>
                            <List>
                                <Link href="/[lang]/get-involved" as={`/${lang}/get-involved`}>
                                    <ListItem button className={classes.menuButton}>
                                        <ListItemText primary={t("common:getInvolved")} />
                                    </ListItem>
                                </Link>
                                <Link href="/[lang]/faq" as={`/${lang}/faq`}>
                                    <ListItem button className={classes.menuButton}>
                                        <ListItemText primary={t("common:faq")} />
                                    </ListItem>
                                </Link>
                                <Link href="/[lang]/cc" as={`/${lang}/cc`}>
                                    <ListItem button className={classes.menuButton}>
                                        <ListItemText primary={t("common:cc")} />
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
