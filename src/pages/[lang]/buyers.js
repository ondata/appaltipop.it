import { useState, useEffect } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useTranslation from 'next-translate/useTranslation'

import axios from 'axios'

import { map, isEmpty } from 'lodash'

import {
    Container,
    Box,
    Grid,
    Typography,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    CircularProgress,
} from '@material-ui/core'

import {
    HighlightOff,
    ArrowForward,
    Flag,
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
    numberFormat,
    timeFormat,
} from '../../utils/formats'

import {
    CURRENCY_FORMAT,
    DATE_FORMAT,
    INTEGER_FORMAT,
    PAGE_SIZE,
    API_VERSION,
} from '../../config/constants'

import {
    getBuyersCount,
    getRedflagsCount,
} from '../../utils/queries'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Partner from '../../components/Partner'
import { BuyersCounter, FlagsCounter } from '../../components/Counter'

function Index({
    buyersCount = 0,
    redflagsCount = 0,
}) {

    const router = useRouter()
    const { t, lang } = useTranslation()

    const nf = numberFormat(lang).format
    const tf = timeFormat(lang).format

    const [ buyers, setBuyers ] = useState([])
    const [ results, setResults ] = useState(0)
    const [ searchString, setSearchString ] = useState("")
    const [ currentSearchString, setCurrentSearchString ] = useState("")
    const [ page, setPage ] = useState(1)
    const [ waiting, setWaiting ] = useState(false)

    function handleSubmit(e) {
        setCurrentSearchString(searchString)
        e.preventDefault()
    }

    function handleReset() {
        setSearchString("")
        setCurrentSearchString("")
        setPage(1)
        setBuyers([])
    }

    function handleChangePage(e, value) {
        setPage(value)
    }

    function handleRequest() {
        if (currentSearchString) {

            setWaiting(true)

            axios
                .get(
                    `/api/${API_VERSION}/buyers`,
                    {
                        params: {
                            q: currentSearchString,
                            lang,
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
        } else {
            setBuyers([])
        }
    }

    useEffect(() => {
        handleRequest()
    }, [currentSearchString])

    useEffect(() => {
        handleRequest()
    }, [page])

    useEffect(() => {
        setWaiting(false)
    }, [buyers])

    return (
        <>

            <Head>
                <title>{t("common:title")}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <Container component="main" maxWidth="md">

                <Box mb={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">
                                {t("common:buyers")}
                            </Typography>
                            <Typography variant="h1">
                                {t("buyer:search.title")}
                            </Typography>
                            <Typography variant="body2">
                                {t("buyer:search.description")}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <BuyersCounter count={buyersCount} label={t("buyer:counter.buyers")} />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <FlagsCounter count={redflagsCount} label={t("buyer:counter.tenders")} />
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={4}>

                    <Typography variant="subtitle1">{t("common:search.title")}</Typography>

                    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="search-field">{t("common:search.help")}</InputLabel>
                                    <OutlinedInput
                                        id="search-field"
                                        value={searchString}
                                        onChange={e => setSearchString(e.target.value)}
                                        endAdornment={
                                            !!searchString
                                            &&
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={t("common:search.reset")}
                                                    onClick={handleReset}
                                                    edge="end"
                                                >
                                                    { waiting ? <CircularProgress /> : <HighlightOff /> }
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained" color="primary" disableElevation
                                    type="submit"
                                    style={{ height: "100%" }}
                                >{t("common:search.cta")}</Button>
                            </Grid>
                        </Grid>
                    </form>

                </Box>

                <Box mb={8}>
                    {
                        !!currentSearchString && !isEmpty(buyers)
                        ?
                        <>
                            <Pagination fullWidth variant="outlined" shape="rounded" count={Math.floor(results/PAGE_SIZE)+(results%PAGE_SIZE ? 1 : 0)} page={page} onChange={handleChangePage} />
                            <List>
                                {
                                    map(
                                        buyers,
                                        buyer => (
                                            <Link key={buyer["ID"]} href="/[lang]/buyer/[id]" as={`/${lang}/buyer/${buyer["ID"]}`}>
                                                <ListItem button>
                                                    <ListItemIcon><ArrowForward color="secondary" /></ListItemIcon>
                                                    <Grid container spacing={2}>
                                                        <Grid item>
                                                            <Typography variant="caption">{t("buyer:ID")}</Typography>
                                                            <Typography variant="body2">{buyer["ID"]}</Typography>
                                                        </Grid>
                                                        <Grid item xs>
                                                            <Typography>{buyer["denominazione"]}</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="caption">{t("common:tenders")}</Typography>
                                                            <Typography variant="body2">{}</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="caption">{t("common:suppliers")}</Typography>
                                                            <Typography variant="body2">{}</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="caption">{t("common:redflags")}</Typography>
                                                            <Typography variant="body2">{}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </ListItem>
                                            </Link>
                                        )
                                    )
                                }
                            </List>
                            <Pagination fullWidth variant="outlined" shape="rounded" count={Math.floor(results/PAGE_SIZE)+(results%PAGE_SIZE ? 1 : 0)} page={page} onChange={handleChangePage} />
                        </>
                        :
                        !!currentSearchString && !waiting && <Typography>{t("common:search.noResults")}</Typography>
                    }
                </Box>

                <Box mb={8}>
                    <Partner
                        images={[
                            "/partners/transparency-international-italy.png",
                            "/partners/parliament-watch-italy.png",
                            "/partners/ondata-italy.png"
                        ]}
                        title={t("buyer:partner.title")}
                        description={t("buyer:partner.description")}
                    />
                </Box>

            </Container>

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
