import { useState, useEffect } from "react"

import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

import useTranslation from "next-translate/useTranslation"

import ReactMarkdown from "react-markdown"

import axios from "axios"

import { map, isEmpty } from "lodash"

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
    Divider,
} from "@material-ui/core"

import { HighlightOff, ArrowForward } from "@material-ui/icons"

import { Pagination } from "@material-ui/lab"

import { getI18nPaths, getI18nProps, withI18n } from "../../utils/i18n"

import {
    CONTAINER_BREAKPOINT,
    PAGE_SIZE,
    API_VERSION,
} from "../../config/constants"

import { getTendersCount, getRedflagsCount } from "../../utils/queries"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import AvatarIcon from "../../components/AvatarIcon"
import { Tender } from "../../components/SearchResult"
import { TendersCounter, FlagsCounter } from "../../components/Counter"

function Index({ tendersCount = 0, redflagsCount = 0 }) {
    const router = useRouter()
    const { t, lang } = useTranslation()

    const [tenders, setTenders] = useState([])
    const [results, setResults] = useState(0)
    const [resultsLabel, setResultsLabel] = useState(<>&nbsp;</>)
    const [searchString, setSearchString] = useState("")
    const [currentSearchString, setCurrentSearchString] = useState("")
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [waiting, setWaiting] = useState(false)

    function handleSubmit(e) {
        setCurrentSearchString(searchString)
        e.preventDefault()
    }

    function handleReset() {
        setSearchString("")
        setTenders([])
        setResults(0)
        setPage(1)
        setCurrentSearchString("")
    }

    function handleChangePage(e, value) {
        setPage(value)
    }

    function handleRequest() {
        if (currentSearchString) {
            setWaiting(true)
            axios
                .get(`/api/${API_VERSION}/tenders`, {
                    params: {
                        q: currentSearchString,
                        lang,
                        page: page - 1,
                    },
                })
                .then((res) => {
                    setResults(res.data.total.value)
                    setTenders(map(res.data.hits, "_source"))
                    setWaiting(false)
                })
        } else {
            setTenders([])
        }
    }

    useEffect(() => {
        setResultsLabel(<>&nbsp;</>)
        setPage(0)
    }, [currentSearchString])

    useEffect(() => {
        if (page) {
            handleRequest()
        } else {
            setPage(1)
        }
    }, [page])

    useEffect(() => {
        setResultsLabel(
            t("search:results", { query: currentSearchString, count: results })
        )
        setPages(
            Math.floor(results / PAGE_SIZE) + (results % PAGE_SIZE ? 1 : 0)
        )
    }, [results])

    return (
        <>
            <Head>
                <title>{`${t("common:tenders")} | ${t("common:title")}`}</title>
            </Head>

            <Header />

            <main>
                <Container component="header" maxWidth={CONTAINER_BREAKPOINT}>
                    <Box mb={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography component="h1" variant="subtitle1">
                                    {t("common:tenders")}
                                </Typography>
                                <Typography component="span" variant="h1">
                                    {t("tender:search.title")}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TendersCounter
                                    count={tendersCount}
                                    label={t("tender:counter.tender", {
                                        count: tendersCount,
                                    })}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <FlagsCounter
                                    count={redflagsCount}
                                    label={t("tender:counter.redflag", {
                                        count: redflagsCount,
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Typography component="div" variant="body2">
                                    <ReactMarkdown
                                        source={t("tender:search.description")}
                                    />
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>

                <Box pb={8} component="section" className="band band-g">
                    <Container maxWidth={CONTAINER_BREAKPOINT}>
                        <Grid container>
                            <Grid item xs={12} sm={8}>
                                <Typography
                                    component="label"
                                    htmlFor="search-field"
                                    variant="subtitle1"
                                >
                                    {t("tender:search.label")}
                                </Typography>
                                <form
                                    noValidate
                                    autoComplete="off"
                                    onSubmit={handleSubmit}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs>
                                            <FormControl
                                                variant="outlined"
                                                fullWidth
                                            >
                                                <OutlinedInput
                                                    id="search-field"
                                                    placeholder={t(
                                                        "tender:search.help"
                                                    )}
                                                    value={searchString}
                                                    onChange={(e) =>
                                                        setSearchString(
                                                            e.target.value
                                                        )
                                                    }
                                                    endAdornment={
                                                        !!searchString && (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label={t(
                                                                        "common:search.reset"
                                                                    )}
                                                                    onClick={
                                                                        handleReset
                                                                    }
                                                                    edge="end"
                                                                >
                                                                    {waiting ? (
                                                                        <CircularProgress />
                                                                    ) : (
                                                                        <HighlightOff />
                                                                    )}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                disableElevation
                                                type="submit"
                                                style={{ height: "100%" }}
                                            >
                                                {t("common:search.cta")}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                                <Typography component="p" variant="caption">
                                    {!!currentSearchString ? (
                                        resultsLabel
                                    ) : (
                                        <>&nbsp;</>
                                    )}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={12}>
                                <Box mt={4}>
                                    {!!currentSearchString && (
                                        <>
                                            {pages > 1 && (
                                                <Pagination
                                                    variant="outlined"
                                                    shape="rounded"
                                                    page={page}
                                                    count={pages}
                                                    onChange={handleChangePage}
                                                />
                                            )}

                                            <List>
                                                {map(
                                                    tenders,
                                                    (tender, index) => (
                                                        <Box
                                                            component="li"
                                                            key={
                                                                tender[
                                                                    "ocds:releases/0/id"
                                                                ]
                                                            }
                                                        >
                                                            {!!index && (
                                                                <Divider />
                                                            )}
                                                            <Link
                                                                href="/[lang]/tender/[id]"
                                                                as={`/${lang}/tender/${tender["ocds:releases/0/id"]}`}
                                                            >
                                                                <ListItem
                                                                    button
                                                                >
                                                                    <ListItemIcon>
                                                                        <AvatarIcon color="primary">
                                                                            <ArrowForward />
                                                                        </AvatarIcon>
                                                                    </ListItemIcon>
                                                                    <Tender
                                                                        {...tender}
                                                                    />
                                                                </ListItem>
                                                            </Link>
                                                        </Box>
                                                    )
                                                )}
                                            </List>

                                            {pages > 1 && (
                                                <Pagination
                                                    variant="outlined"
                                                    shape="rounded"
                                                    page={page}
                                                    count={pages}
                                                    onChange={handleChangePage}
                                                />
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </main>

            <Footer />
        </>
    )
}

export const getStaticProps = async (ctx) => {
    return {
        props: {
            ...(await getI18nProps(ctx, ["common", "tender", "search"])),
            tendersCount: await getTendersCount(),
            redflagsCount: await getRedflagsCount(),
        },
        unstable_revalidate: 3600,
    }
}

export const getStaticPaths = async () => ({
    paths: getI18nPaths(),
    fallback: false,
})

export default withI18n(Index)
