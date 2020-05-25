import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useTranslation from 'next-translate/useTranslation'

import { map } from 'lodash'

import {
    Container,
    Box,
    Grid,
    Typography,
    Avatar,
} from '@material-ui/core'

import {
    Print,
    GetApp,
    Sports,
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
    CURRENCY_FORMAT,
    DATE_FORMAT,
    INTEGER_FORMAT,
} from '../../../../config/constants'

import {
    getSupplierById,
    getTendersCountBySupplier,
    getRedflagsCountBySupplier,
    getTendersValueAmountBySupplier,
    getTendersTransactionAmountBySupplier,
} from '../../../../utils/queries'

import { getSupplierPaths } from '../../../../utils/paths'

import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'

import { FlagsCounter, TendersCounter } from '../../../../components/Counter'
import FlagsInfo from '../../../../components/FlagsInfo'
import KeyValue from '../../../../components/KeyValue'
import DonutChart from '../../../../components/DonutChart'
import BarChart from '../../../../components/BarChart'
import Cta from '../../../../components/Cta'
import Partner from '../../../../components/Partner'

function Index({
    supplier = {},
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
                    <title>{t("common:title")}</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <Header />

                <Container component="main" maxWidth="md">

                    <Box mb={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="secondary">
                                    {t("common:supplier")}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="subtitle2" color="secondary">
                                    <a target="_blank" href="#">
                                        {t("common:print")}&nbsp;<Print />
                                    </a>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Typography variant="subtitle2" color="secondary">
                                    <a target="_blank" href="#">
                                        {t("common:download")}&nbsp;<GetApp />
                                    </a>
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h1">
                                    {supplier["ragione sociale"]}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TendersCounter count={tendersCount} label={t(`common:tender${tendersCount === 1 ? "" : "s"}`)} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <FlagsCounter count={redflagsCount} label={t(`common:redflag${redflagsCount === 1 ? "" : "s"}`)} />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box mb={8}>
                        <Grid container spacing={2}>

                            <Grid item xs={4}>
                                <KeyValue title={t("supplier:province")} label={supplier["province"]} />
                            </Grid>

                            <Grid item xs={4}>
                                <KeyValue title={t("supplier:region")} label={supplier["region"]} />
                            </Grid>

                            <Grid item xs={4}>
                                <KeyValue title={t("supplier:cf")} label={supplier["CF"]} />
                            </Grid>

                            <Grid item xs={6}>
                                <KeyValue title={t("supplier:valueAmount")} label={nf(CURRENCY_FORMAT)(valueAmount)} />
                            </Grid>

                            <Grid item xs={6}>
                                <KeyValue title={t("supplier:transactionAmount")} label={nf(CURRENCY_FORMAT)(transactionAmount)} />
                            </Grid>

                        </Grid>
                    </Box>
                    
                    <Box mb={8}>
                        <Grid container spacing={2}>

                            <Grid item xs={12} sm={6}>
                                <BarChart title={t("supplier:bar.1.title")} description={t("supplier:bar.1.description")} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <BarChart title={t("supplier:bar.2.title")} description={t("supplier:bar.2.description")} />
                            </Grid>

                        </Grid>
                    </Box>
                    
                    <Box mb={8}>
                        <BarChart title={t("supplier:bar.3.title")} description={t("supplier:bar.3.description")} />
                    </Box>

                    <Box mb={8}>
                        <Typography variant="h2">{t("common:tenders")}</Typography>
                        <Typography>...</Typography>
                    </Box>

                    <Box mb={8}>
                        <Typography variant="h2">{t("common:buyers")}</Typography>
                        <Typography>...</Typography>
                    </Box>

                </Container>

                <Footer />

            </>
        )
    }
}

export const getStaticProps = async ctx => ({
    props: {
        ...(await getI18nProps(ctx, ['common','supplier'])),
        supplier: await getSupplierById(ctx.params.id),
        tendersCount: await getTendersCountBySupplier(ctx.params.id),
        redflagsCount: await getRedflagsCountBySupplier(ctx.params.id),
        valueAmount: await getTendersValueAmountBySupplier(ctx.params.id),
        transactionAmount: await getTendersTransactionAmountBySupplier(ctx.params.id),
    }
})

export const getStaticPaths = async () => ({
    paths: await getSupplierPaths(),
    fallback: true,
})

export default withI18n(Index)
