import Head from 'next/head'
import Link from 'next/link'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import {
    Container,
    Typography,
    Box,
} from '@material-ui/core'

import {
    getI18nPaths,
    getI18nProps,
    withI18n,
} from '../../utils/i18n'

import { CONTAINER_BREAKPOINT } from '../../config/constants'

import Footer from '../../components/Footer'
import Header from '../../components/Header'

function Index() {

    const { t, lang } = useTranslation()

    return (
        <>

            <Head>
                <title>{`${t("common:cc")} | ${t("common:title")}`}</title>
            </Head>

            <Header />

            <main>

            <Container component="header" maxWidth={CONTAINER_BREAKPOINT}>
                <Box mb={8} mt={8}>
                    <Typography variant="h1">{t("cc:title", { page: t("common:cc") })}</Typography>
                    <Typography component="div" variant="body2">
                        <ReactMarkdown source={t("cc:body", { page: t("common:cc") }, { returnObjects: true }).join("\n\n")} />
                    </Typography>
                </Box>
            </Container>

            </main>

            <Footer />

        </>
    )
}

export const getStaticProps = async (ctx) => ({
    props: await getI18nProps(ctx, ['common','cc'])
})

export const getStaticPaths = async () => ({
    paths: getI18nPaths(),
    fallback: false,
})

export default withI18n(Index)
