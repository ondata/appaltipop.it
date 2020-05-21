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

import { getTenderById } from '../../../../utils/queries'
import { getTenderPaths } from '../../../../utils/paths'

import Footer from '../../../../components/Footer'
import Header from '../../../../components/Header'
import FlagsCount from '../../../../components/FlagsCount'
import FlagsInfo from '../../../../components/FlagsInfo'
import KeyValue from '../../../../components/KeyValue'
import DonutChart from '../../../../components/DonutChart'
import BarChart from '../../../../components/BarChart'
import Cta from '../../../../components/Cta'
import Partner from '../../../../components/Partner'

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

                    <Box mb={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="secondary">
                                    {t("common:tender")}
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
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h1">
                                    {tender["appalto"]}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FlagsCount flags={redflags} />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box mb={8}>
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
                    </Box>
                    
                    <Box mb={8}>
                        <FlagsInfo flags={map(redflags, "codice redflag")} />
                    </Box>

                    <Box mb={8}>
                        <Grid container spacing={2} justify="center">
                            <Grid item xs={6} sm={4}>
                                <Cta icon={<Avatar>FOIA</Avatar>} title={t("cta:foia.title")} href={t("cta:foia.url")} />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Cta icon={<Avatar><Sports /></Avatar>} title={t("cta:whistle.title")} href={t("cta:whistle.url")} />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box mb={8}>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <Typography variant="h2">
                                    {t("common:suppliers")}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1">
                                    {t("tender:suppliersDescription")}
                                </Typography>
                            </Grid>

                        </Grid>

                        {
                            map(
                                suppliers,
                                (supplier, index) => (
                                    <Grid
                                        key={supplier["CF"]}
                                        container spacing={2}
                                    >
                                        <Grid item xs={12}>
                                            <KeyValue
                                                title={`${index+1}. ${t("supplier:ragioneSociale")}`}
                                                label={supplier["ragione sociale"]}
                                                href="/[lang]/supplier/[id]"
                                                as={`/${lang}/supplier/${supplier["CF"]}`}
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <KeyValue title={t("supplier:provincia")} label={supplier["provincia"]} />
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <KeyValue title={t("supplier:regione")} label={supplier["regione"]} />
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <KeyValue title={t("supplier:cf")} label={supplier["CF"]} />
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <KeyValue
                                                title={t("supplier:importoTotaleAppaltiConStessoEnte")}
                                                label={nf(CURRENCY_FORMAT)(supplier["importo totale appalti con lo stesso ente"])}
                                            />
                                        </Grid>
                                    </Grid>
                                    
                                )
                            )
                        }
                    </Box>

                    <Box mb={8}>
                        <Grid container spacing={2}>

                            <Grid item xs={12} sm={4}>
                                <DonutChart title={t("tender:donut.1.title")} description={t("tender:donut.1.description")} />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <DonutChart title={t("tender:donut.2.title")} description={t("tender:donut.2.description")} />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <DonutChart title={t("tender:donut.3.title")} description={t("tender:donut.3.description")} />
                            </Grid>

                        </Grid>
                    </Box>
                    
                    <Box mb={8}>
                        <BarChart title={t("tender:bar.1.title")} description={t("tender:bar.1.description")} />
                    </Box>

                    <Box mb={8}>
                        <Partner
                            images={["/partner/transparency-international-italy.png"]}
                            title={t("tender:monitoredBy.title")}
                            description={t("tender:monitoredBy.description")}
                        />
                    </Box>

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
            ...(await getI18nProps(ctx, ['common','tender','supplier','redflags','cta'])),
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
