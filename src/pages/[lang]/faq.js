import Head from 'next/head'
import Link from 'next/link'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import {
    Container,
    Box,
} from '@material-ui/core'

import {
    getStaticPage,
} from '../../utils/pages'

import {
    getI18nPaths,
    getI18nProps,
    withI18n,
} from '../../utils/i18n'

import { CONTAINER_BREAKPOINT } from '../../config/constants'

import Footer from '../../components/Footer'
import Header from '../../components/Header'

function Index({ content }) {

    const { t, lang } = useTranslation()

    return (
        <>

            <Head>
                <title>{`${t("common:faq")} | ${t("common:title")}`}</title>
            </Head>

            <Header />

            <main>

            <Container component="header" maxWidth={CONTAINER_BREAKPOINT}>
                <Box mb={8} mt={8}>
                    <ReactMarkdown source={content} />
                </Box>
            </Container>

            </main>

            <Footer />

        </>
    )
}

export const getStaticProps = async (ctx) => ({
    props: {
        ...(await getI18nProps(ctx, ['common','faq'])),
        content: await getStaticPage(ctx.params.lang, 'faq'),
    }
})

export const getStaticPaths = async () => ({
    paths: getI18nPaths(),
    fallback: false,
})

export default withI18n(Index)
