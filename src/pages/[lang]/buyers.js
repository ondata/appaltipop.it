import { useState, useEffect } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import {
    Container,
    Box,
    Grid,
    Typography,
} from '@material-ui/core'

import {
    getI18nPaths,
    getI18nProps,
    withI18n,
} from '../../utils/i18n'

import {
    CONTAINER_BREAKPOINT,
    PAGE_SIZE,
    API_VERSION,
} from '../../config/constants'

import {
    getBuyersCount,
    getRedflagsCount,
} from '../../utils/queries'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SearchResults from '../../components/SearchResults'
import { Buyer } from '../../components/SearchResult'
import { BuyersCounter, FlagsCounter } from '../../components/Counter'

function Index({
    buyersCount = 0,
    redflagsCount = 0,
}) {

    const router = useRouter()
    const { t, lang } = useTranslation()

    return (
        <>

            <Head>
                <title>{`${t("common:buyers")} | ${t("common:title")}`}</title>
            </Head>

            <Header />

            <main>

                <Container component="header" maxWidth={CONTAINER_BREAKPOINT}>
                    <Box mb={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography component="h1" variant="subtitle1">
                                    {t("common:buyers")}
                                </Typography>
                                <Typography component="span" variant="h1">
                                    {t("buyer:search.title")}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <BuyersCounter count={buyersCount} label={t("buyer:counter.buyer", { count: buyersCount })} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <FlagsCounter count={redflagsCount} label={t("buyer:counter.redflag", { count: redflagsCount })} />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Typography component="div" variant="body2">
                                    <ReactMarkdown source={t("buyer:search.description")} />
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>

                <Box component="section" className="band band-g">
                    <Container maxWidth={CONTAINER_BREAKPOINT}>
                        <SearchResults
                            endpoint={`/api/${API_VERSION}/buyers`}
                            itemId="ocds:releases/0/buyer/id"
                            itemType="buyer"
                        >
                            <Buyer />
                        </SearchResults>
                    </Container>
                </Box>

            </main>

            <Footer />

        </>
    )

}

export const getStaticProps = async ctx => {
    return {
        props: {
            ...(await getI18nProps(ctx, ['common', 'buyer'])),
            buyersCount: await getBuyersCount(),
            redflagsCount: await getRedflagsCount()
        },
        unstable_revalidate: 3600,
    }
}

export const getStaticPaths = async () => ({
    paths: getI18nPaths(),
    fallback: false,
})

export default withI18n(Index)
