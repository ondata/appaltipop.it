import Head from 'next/head'
import Link from 'next/link'

import useTranslation from 'next-translate/useTranslation'

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

import {
    getTendersCount,
    getBuyersCount,
    getSuppliersCount,
} from '../../utils/queries'

import Footer from '../../components/Footer'
import Header from '../../components/Header'

function Index({ tenders, buyers, suppliers }) {

    const { t, lang } = useTranslation()

    return (
        <>

            <Head>
                <title>{t("common:title")}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main>

                <Container maxWidth="md">
                    <img src="/logo.png" alt="AlboPOP" title="AlboPOP" />
                    <Typography variant="subtitle1">
                        {t("common:claim")}
                    </Typography>
                </Container>

                <Container maxWidth="md">
                    <Box mb={8} mt={16}>
                        <Grid container spacing={4} justify="center">
                            <Grid item xs={12}>
                                <Paper elevation={0}>
                                    <Typography variant="body2">
                                        {t("home:introduction")}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Button
                                    target="_blank" href={t("cta:monitor.url")}
                                    variant="contained" size="large" color="secondary" disableElevation
                                >
                                    {t("cta:monitor.title")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    target="_blank" href={t("cta:search.url")}
                                    variant="contained" size="large" color="secondary" disableElevation
                                >
                                    {t("cta:search.title")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>

                <Box className="home__band home__band-b">
                    <Container maxWidth="md">
                        <Typography variant="h2">
                            {t("home:ocds.title")}
                        </Typography>
                        <Typography variant="body2">
                            {t("home:ocds.description")}
                        </Typography>
                    </Container>
                </Box>

                <Box className="home__band home__band-g">
                    <Container maxWidth="md">
                        <Grid container spacing={4}>
                            <Grid item xs={8} sm={6}>
                                <Typography variant="h2">
                                    {t("home:practice.title")}
                                </Typography>
                                <Typography variant="body2">
                                    {t("home:practice.description")}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sm={6}>
                                <img src="/partners/ocds-logo.png" alt="OCDS" title="OCDS" style={{width:"100%"}} />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                <Box className="home__band home__band-w">
                    <Container maxWidth="md">
                        <Typography variant="h2">
                            {t("home:todo.title")}
                        </Typography>
                        <Typography variant="body2">
                            {t("home:todo.description")}
                        </Typography>
                    </Container>
                </Box>

                <Box className="home__band home__band-b">
                    <Grid container spacing={2} direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="h2" align="center">
                                {t("home:buyer.title")}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" align="center">
                                {t("home:buyer.description")}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                target="_blank" href={t("cta:participate.url")}
                                variant="contained" size="large" color="secondary" disableElevation
                            >
                                {t("cta:participate.title")}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

            </main>

            <Footer />

        </>
    )
}

export const getStaticProps = async (ctx) => ({
    props: {
        ...(await getI18nProps(ctx, ['common','home','cta'])),
        tenders: await getTendersCount(),
        buyers: await getBuyersCount(),
        suppliers: await getSuppliersCount(),
    }
})

export const getStaticPaths = async () => ({
    paths: getI18nPaths(),
    fallback: false,
})

export default withI18n(Index)
