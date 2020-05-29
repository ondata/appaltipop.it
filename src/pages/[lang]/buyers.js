import { useState, useEffect } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import axios from 'axios'

import { map, isEmpty } from 'lodash'

import {
    Container,
    Box,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemIcon,
} from '@material-ui/core'

import {
    ArrowForward,
} from '@material-ui/icons'

import {
    Pagination,
} from '@material-ui/lab'

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
    getBuyers,
    getBuyersCount,
    getRedflagsCount,
} from '../../utils/queries'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AvatarIcon from '../../components/AvatarIcon'
import { Buyer } from '../../components/SearchResult'
import { BuyersCounter, FlagsCounter } from '../../components/Counter'

function Index({
    firstBuyers = [],
    buyersCount = 0,
    redflagsCount = 0,
}) {

    const router = useRouter()
    const { t, lang } = useTranslation()

    const [ buyers, setBuyers ] = useState(firstBuyers)
    const [ results, setResults ] = useState(buyersCount)
    const [ page, setPage ] = useState(1)
    const [ pages, setPages ] = useState(1)

    function handleChangePage(e, value) {
        setPage(value)
    }

    function handleRequest() {
        axios
            .get(
                `/api/${API_VERSION}/buyers`,
                {
                    params: {
                        page: page-1,
                    }
                }
            )
            .then(
                res => {
                    setResults(res.data.total.value)
                    setBuyers(map(res.data.hits, "_source"))
                }
            )
    }

    useEffect(() => {
        handleRequest()
    }, [page])

    useEffect(() => {
        setPages(Math.floor(results/PAGE_SIZE)+(results%PAGE_SIZE ? 1 : 0))
    }, [results])

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
                        <Grid container>
                            <Grid item xs={12} sm={8}>
                                {
                                    !isEmpty(buyers)
                                    ?
                                    <>

                                        {
                                            pages > 1
                                            &&
                                            <Pagination
                                                variant="outlined" shape="rounded"
                                                page={page} count={pages}
                                                onChange={handleChangePage}
                                            />
                                        }

                                        <List>
                                            {
                                                map(
                                                    buyers,
                                                    buyer => (
                                                        <Link key={buyer["ocds:releases/0/buyer/id"]} href="/[lang]/buyer/[id]" as={`/${lang}/buyer/${buyer["ocds:releases/0/buyer/id"]}`}>
                                                            <ListItem button>
                                                                <ListItemIcon>
                                                                    <AvatarIcon color="primary"><ArrowForward /></AvatarIcon>
                                                                </ListItemIcon>
                                                                <Buyer {...buyer} />
                                                            </ListItem>
                                                        </Link>
                                                    )
                                                )
                                            }
                                        </List>

                                        {
                                            pages > 1
                                            &&
                                            <Pagination
                                                variant="outlined" shape="rounded"
                                                page={page} count={pages}
                                                onChange={handleChangePage}
                                            />
                                        }

                                    </>
                                    :
                                    !!currentSearchString && !waiting && <Typography>{t("common:search.noResults")}</Typography>
                                }
                            </Grid>
                        </Grid>
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
            firstBuyers: map((await getBuyers()).hits, "_source"),
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
