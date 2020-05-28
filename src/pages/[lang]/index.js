import Head from 'next/head'
import Link from 'next/link'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import {
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    Box,
} from '@material-ui/core'

import {
    getI18nPaths,
    getI18nProps,
    withI18n,
} from '../../utils/i18n'

import { CONTAINER_BREAKPOINT } from '../../config/constants'

import {
    getTendersCount,
    getBuyersCount,
    getSuppliersCount,
} from '../../utils/queries'

import Footer from '../../components/Footer'
import Header from '../../components/Header'

function Index({ tendersCount, buyersCount, suppliersCount }) {

    const { t, lang } = useTranslation()

    return (
        <>

            <Head>
                <title>{t("common:title")}</title>
            </Head>

            <Header />

            <main>

                <Container component="header" maxWidth={CONTAINER_BREAKPOINT}>
                    <Box component="h1" m={0}>
                        <img src="/logo.png" alt="AppaltiPOP" title="AppaltiPOP" style={{maxWidth:"100%"}} />
                    </Box>
                    <Typography component="span" variant="subtitle1">
                        {t("common:claim")}
                    </Typography>
                </Container>

                <Container component="section" maxWidth={CONTAINER_BREAKPOINT}>
                    <Box mb={8} mt={8}>
                        <Grid container spacing={4} justify="center">
                            <Grid item xs={12}>
                                <Paper elevation={0}>
                                    <Typography variant="body2">
                                        {t("home:introduction")}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm="auto">
                                <Button
                                    target="_blank" href={t("cta:monitor.url")}
                                    fullWidth
                                    variant="contained" size="large" color="secondary" disableElevation
                                >
                                    {t("cta:monitor.title")}
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm="auto">
                                <Button
                                    target="_blank" href={t("cta:search.url")}
                                    fullWidth
                                    variant="contained" size="large" color="secondary" disableElevation
                                >
                                    {t("cta:search.title")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>

                <Box component="section" className="band band-b band-home">
                    <Container maxWidth={CONTAINER_BREAKPOINT}>
                        <Typography variant="h2">
                            {t("home:ocds.title")}
                        </Typography>
                        <Typography component="div" variant="body2">
                            <ReactMarkdown source={t("home:ocds.description")} linkTarget="_blank" />
                        </Typography>
                    </Container>
                </Box>

                <Box component="section" className="band band-g band-home">
                    <Container maxWidth={CONTAINER_BREAKPOINT}>
                        <Typography variant="h2">
                            {t("home:practice.title")}
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <Typography component="div" variant="body2">
                                    <ReactMarkdown source={t("home:practice.description")} />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <img src="/partners/ocds-logo.png" alt="OCDS" title="OCDS" style={{width:"100%"}} />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                <Box component="section" className="band band-w band-home">
                    <Container maxWidth={CONTAINER_BREAKPOINT}>
                        <Typography variant="h2">
                            {t("home:todo.title")}
                        </Typography>
                        <Typography component="div" variant="body2">
                            <ReactMarkdown source={t("home:todo.description")} />
                        </Typography>
                    </Container>
                </Box>

                <Box component="section" className="band band-b band-home">
                    <Container maxWidth="md">

                        <Typography variant="h2" align="center">
                            {t("home:buyer.title")}
                        </Typography>

                        <Typography component="div" variant="body2" align="center">
                            <ReactMarkdown source={t("home:buyer.description")} linkTarget="_blank" />
                        </Typography>

                        <Box mt={4} textAlign="center">
                            <Button
                                target="_blank" href={t("cta:participate.url")}
                                variant="contained" size="large" color="secondary" disableElevation
                            >
                                {t("cta:participate.title")}
                            </Button>
                        </Box>

                    </Container>
                </Box>

            </main>

            <Footer />

        </>
    )
}

export const getStaticProps = async (ctx) => ({
    props: {
        ...(await getI18nProps(ctx, ['common','home','cta'])),
        tendersCount: await getTendersCount(),
        buyersCount: await getBuyersCount(),
        suppliersCount: await getSuppliersCount(),
    }
})

export const getStaticPaths = async () => ({
    paths: getI18nPaths(),
    fallback: false,
})

export default withI18n(Index)
