import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import { map, range, padStart } from 'lodash'

import {
    Container,
    Box,
    Grid,
    Typography,
    Paper,
    ListItem,
    ListItemIcon,
    ListItemText,
    List,
    Divider,
} from '@material-ui/core'

import {
    Print,
    GetApp,
    Flag,
    ArrowForward,
} from '@material-ui/icons'

import {
    getI18nProps,
    withI18n,
} from '../../../../utils/i18n'

import {
    numberFormat,
    timeFormat,
} from '../../../../utils/formats'

import {
    CONTAINER_BREAKPOINT,
    CURRENCY_FORMAT,
    DATE_FORMAT,
    INTEGER_FORMAT,
} from '../../../../config/constants'

import {
    getBuyerById,
    getTendersCountByBuyer,
    getRedflagsCountByBuyer,
    getTendersValueAmountByBuyer,
    getTendersTransactionAmountByBuyer,
    getSuppliersByBuyer,
    getTendersByBuyer,
} from '../../../../utils/queries'

import { getBuyerPaths } from '../../../../utils/paths'

import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'

import { FlagsCounter, TendersCounter } from '../../../../components/Counter'
import { Tender, Supplier } from '../../../../components/SearchResult'
import KeyValue from '../../../../components/KeyValue'
import AvatarIcon from '../../../../components/AvatarIcon'
import BarChart from '../../../../components/BarChart'

function Index({
    buyer = {},
    tenders = [],
    suppliers = [],
    tendersCount = 0,
    redflagsCount = 0,
    valueAmount = 0,
    transactionAmount = 0,
}) {

    const router = useRouter()
    const { t, lang } = useTranslation()

    const nf = numberFormat(lang).format
    const tf = timeFormat(lang).format

    if (router.isFallback) {
        return <div>Loading...</div>
    } else {
        return (
            <>

                <Head>
                    <title>{`${t("common:buyer")} n. ${buyer["ID"]} | ${t("common:title")}`}</title>
                </Head>

                <Header />

                <main>

                    <Container component="header" maxWidth={CONTAINER_BREAKPOINT}>

                        <Box mb={8}>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography component="span" variant="subtitle1">
                                        {t("common:buyer")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Typography component="div" variant="subtitle1">
                                        <Grid container spacing={2}>
                                            <Grid item>
                                                <a target="_blank" href="#">
                                                    {t("common:print")}
                                                </a>
                                            </Grid>
                                            <Grid item>
                                                <AvatarIcon color="primary"><Print /></AvatarIcon>
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Typography component="div" variant="subtitle1">
                                        <Grid container spacing={2}>
                                            <Grid item>
                                                <a target="_blank" href="#">
                                                    {t("common:download")}
                                                </a>
                                            </Grid>
                                            <Grid item>
                                                <AvatarIcon color="primary"><GetApp /></AvatarIcon>
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h1">
                                        {buyer["denominazione"]}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TendersCounter count={tendersCount} label={t("common:tender", { count: tendersCount })} />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <FlagsCounter count={redflagsCount} label={t("common:redflag", { count: redflagsCount })} />
                                </Grid>
                            </Grid>

                        </Box>

                    </Container>

                    <Container component="section" maxWidth={CONTAINER_BREAKPOINT}>

                        <Box mb={8}>
                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={4}>
                                    <KeyValue title={t("buyer:id")} label={buyer["ID"]} />
                                </Grid>

                                <Grid item xs={6} sm={4}>
                                    <KeyValue title={t("buyer:province")} label={buyer["province"]} />
                                </Grid>

                                <Grid item xs={6} sm={4}>
                                    <KeyValue title={t("buyer:region")} label={buyer["region"]} />
                                </Grid>

                                <Grid item xs={6}>
                                    <KeyValue title={t("buyer:valueAmount")} label={nf(CURRENCY_FORMAT)(valueAmount)} />
                                </Grid>

                                <Grid item xs={6}>
                                    <KeyValue title={t("buyer:transactionAmount")} label={nf(CURRENCY_FORMAT)(transactionAmount)} />
                                </Grid>

                            </Grid>
                        </Box>

                    </Container>

                    <Container component="section" maxWidth={CONTAINER_BREAKPOINT}>

                        <Box mb={8}>
                            <Paper elevation={0}>
                                <Typography component="div" variant="body2">
                                    <ReactMarkdown source={t("redflags:info")} />
                                </Typography>
                            </Paper>
                        </Box>

                        <Box mb={8}>

                            <Typography variant="h2" color="inherit">
                                {t("redflags:title")}
                            </Typography>

                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={6}>

                                    <List disablePadding>
                                        {
                                            map(
                                                map(range(1,+t("redflags:flags")+1), redflag => padStart(redflag,2,0)),
                                                flag => (
                                                    <ListItem key={flag} style={{backgroundColor:"#f9f9f9",border:"2px solid #E7E5FF",borderRadius:8,marginBottom:16}}>
                                                        <ListItemIcon><Flag color="secondary" /></ListItemIcon>
                                                        <ListItemText primary={t(`redflags:${flag}.title`)} secondary={t(`redflags:${flag}.summary`)} />
                                                    </ListItem>
                                                )
                                            )
                                        }
                                    </List>

                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Paper elevation={0}>
                                        Lorem ipsum...
                                    </Paper>
                                </Grid>

                            </Grid>

                        </Box>

                    </Container>

                    <Container component="section" maxWidth={CONTAINER_BREAKPOINT}>
                        
                        <Box mb={8}>

                            <Typography variant="h2" color="inherit">
                                {t("buyer:charts")}
                            </Typography>

                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={6}>
                                    <BarChart title={t("buyer:bar.1.title")} description={t("buyer:bar.1.description")} inverse />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <BarChart title={t("buyer:bar.2.title")} description={t("buyer:bar.2.description")} inverse />
                                </Grid>

                            </Grid>
                        </Box>
                        
                        <Box mb={8}>
                            <BarChart title={t("buyer:bar.3.title")} description={t("buyer:bar.3.description")} inverse />
                        </Box>
                        
                    </Container>

                    <Box mb={8} className="band band-g">
                        <Container component="section" maxWidth={CONTAINER_BREAKPOINT}>
                            <Typography variant="h2" color="inherit">{t("common:tenders")}</Typography>
                            <List>
                                {
                                    map(
                                        tenders,
                                        (tender, index) => (
                                            <Box component="li" key={tender["cig"]}>
                                                { !!index && <Divider /> }
                                                <Link href="/[lang]/tender/[id]" as={`/${lang}/tender/${tender["cig"]}`}>
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <AvatarIcon color="primary"><ArrowForward /></AvatarIcon>
                                                        </ListItemIcon>
                                                        <Tender {...tender} />
                                                    </ListItem>
                                                </Link>
                                            </Box>
                                        )
                                    )
                                }
                            </List>
                        </Container>
                    </Box>

                    <Box mb={8} className="band band-g">
                        <Container component="section" maxWidth={CONTAINER_BREAKPOINT}>
                            <Typography variant="h2" color="inherit">{t("common:suppliers")}</Typography>
                            <List>
                                {
                                    map(
                                        suppliers,
                                        (supplier, index) => (
                                            <Box component="li" key={supplier["CF"]}>
                                                { !!index && <Divider /> }
                                                <Link href="/[lang]/supplier/[id]" as={`/${lang}/supplier/${supplier["CF"]}`}>
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <AvatarIcon color="primary"><ArrowForward /></AvatarIcon>
                                                        </ListItemIcon>
                                                        <Supplier {...supplier} />
                                                    </ListItem>
                                                </Link>
                                            </Box>
                                        )
                                    )
                                }
                            </List>
                        </Container>
                    </Box>

                </main>

                <Footer />

            </>
        )
    }
}

export const getStaticProps = async ctx => ({
    props: {
        ...(await getI18nProps(ctx, ['common','buyer','redflags'])),
        buyer: await getBuyerById(ctx.params.id),
        tenders: map((await getTendersByBuyer(ctx.params.id)).hits, "_source"),
        suppliers: await getSuppliersByBuyer(ctx.params.id),
        tendersCount: await getTendersCountByBuyer(ctx.params.id),
        redflagsCount: await getRedflagsCountByBuyer(ctx.params.id),
        valueAmount: await getTendersValueAmountByBuyer(ctx.params.id),
        transactionAmount: await getTendersTransactionAmountByBuyer(ctx.params.id),
    }
})

export const getStaticPaths = async () => ({
    paths: await getBuyerPaths(),
    fallback: true,
})

export default withI18n(Index)
