import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useTranslation from 'next-translate/useTranslation'

import { map } from 'lodash'

import {
    Container, Grid, Typography,
} from '@material-ui/core'

//import {} from '@material-ui/icons'

import {
    getI18nProps,
    withI18n,
} from '../../../utils/i18n'

import {
    numberFormat,
    timeFormat,
} from '../../../utils/formats'

import {
    CURRENCY_FORMAT,
    DATE_FORMAT,
    INTEGER_FORMAT,
} from '../../../config/constants'

import { getTenderById } from '../../../utils/queries'
import { getTenderPaths } from '../../../utils/paths'

import Footer from '../../../components/Footer'
import Header from '../../../components/Header'
import FlagsCount from '../../../components/FlagsCount'
import KeyValue from '../../../components/KeyValue'

function Index({
    tender = {},
    buyers = [],
    suppliers = [],
    redflags = [],
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

                    <Grid container spacing={2}>
                        <Grid item xs={4} sm={8}>
                            {t("common:tender")}
                        </Grid>
                        <Grid item xs={4} sm={2}>
                            <a target="_blank" href="#">
                                {t("common:print")}
                            </a>
                        </Grid>
                        <Grid item xs={4} sm={2}>
                            <a target="_blank" href="#">
                                {t("common:download")}
                            </a>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography variant="h1">
                                {tender["appalto"]}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <FlagsCount flags={redflags} />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>

                        <Grid item xs={12}>
                            {
                                map(
                                    buyers,
                                    (buyer, index) => (
                                        <KeyValue
                                            key={buyer["ID"]}
                                            title={!index ? t("common:buyers") : ""}
                                            label={buyer["denominazione"]}
                                            href="/[lang]/buyer/[id]"
                                            as={`/${lang}/buyer/${buyer["ID"]}`}
                                        />
                                    )
                                )
                            }
                        </Grid>

                        <Grid item xs={12}>
                            {
                                map(
                                    suppliers,
                                    (supplier, index) => (
                                        <KeyValue
                                            key={supplier["CF"]}
                                            title={!index ? t("common:suppliers") : ""}
                                            label={supplier["ragione sociale"]}
                                            href="/[lang]/supplier/[id]"
                                            as={`/${lang}/supplier/${supplier["CF"]}`}
                                        />
                                    )
                                )
                            }
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <KeyValue title={t("tender:cig")} label={tender["cig"]} />
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <KeyValue title={t("tender:startDate")} label={tf(DATE_FORMAT)(new Date(tender["data inizio"]))} />
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <KeyValue title={t("tender:endDate")} label={tf(DATE_FORMAT)(new Date(tender["data fine"]))} />
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <KeyValue title={t("tender:numberOfParticipants")} label={nf(INTEGER_FORMAT)(suppliers.length)} />
                        </Grid>

                        <Grid item xs={12}>
                            <KeyValue title={t("tender:type")} label={tender["tipo"]} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <KeyValue title={t("tender:valueAmount")} label={nf(CURRENCY_FORMAT)(tender["importo aggiudicazione"])} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <KeyValue title={t("tender:transactionAmount")} label={nf(CURRENCY_FORMAT)(tender["importo somme liquidate"])} />
                        </Grid>

                    </Grid>

                </Container>

                <Footer />

            </>
        )
    }
}

export const getStaticProps = async ctx => {
    const tender = await getTenderById(ctx.params.id)
    return {
        props: {
            ...(await getI18nProps(ctx, ['common','tender'])),
            tender,
            buyers: tender["pubblica amministrazione proponente"] || [],
            suppliers: tender["aggiudicatari"] || [],
            redflags: tender["redflags"] || [],
        }
    }
}

export const getStaticPaths = async () => ({
    paths: await getTenderPaths(),
    fallback: true,
})

export default withI18n(Index)
