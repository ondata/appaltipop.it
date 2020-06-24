import Head from "next/head"
import Link from "next/link"

import useTranslation from "next-translate/useTranslation"

import ReactMarkdown from "react-markdown"

import { Container, Box, Typography } from "@material-ui/core"

import { getStaticPage } from "../../utils/pages"

import { getI18nPaths, getI18nProps, withI18n } from "../../utils/i18n"

import { CONTAINER_BREAKPOINT } from "../../config/constants"

import Footer from "../../components/Footer"
import Header from "../../components/Header"

function Index({ contents }) {
    const { t, lang } = useTranslation()

    return (
        <>
            <Head>
                <title>{`${t("common:download")} | ${t(
                    "common:title"
                )}`}</title>
            </Head>

            <Header />

            <main>
                <Container component="header" maxWidth={CONTAINER_BREAKPOINT}>
                    <Box mb={8} mt={8}>
                        <Typography variant="h1">
                            {t("download:title")}
                        </Typography>
                        <Typography component="div" variant="body2">
                            <ReactMarkdown
                                source={contents["download"].content}
                            />
                        </Typography>
                        <Typography variant="h2">
                            {t("download:dataset")}
                        </Typography>
                    </Box>
                    <Typography variant="h2">{t("download:pa")}</Typography>
                </Container>
            </main>

            <Footer />
        </>
    )
}

export const getStaticProps = async (ctx) => {
    const { lang, namespaces } = await getI18nProps(ctx, ["common", "download"])
    return {
        props: {
            lang,
            namespaces,
            contents: {
                download: await getStaticPage(namespaces["download"]),
            },
        },
    }
}

export const getStaticPaths = async () => ({
    paths: getI18nPaths(),
    fallback: false,
})

export default withI18n(Index)
