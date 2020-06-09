import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

import useTranslation from "next-translate/useTranslation"

import { map } from "lodash"

import {
    Container,
    Box,
    Grid,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    Divider,
} from "@material-ui/core"

import { Print, GetApp, Sports, ArrowForward } from "@material-ui/icons"

import { getI18nProps, withI18n } from "../../../../utils/i18n"

import { numberFormat, timeFormat } from "../../../../utils/formats"

import {
    CONTAINER_BREAKPOINT,
    CURRENCY_FORMAT,
    DATE_FORMAT,
    INTEGER_FORMAT,
} from "../../../../config/constants"

import { getTenderById } from "../../../../utils/queries"
import { getTenderPaths } from "../../../../utils/paths"

import Header from "../../../../components/Header"
import Footer from "../../../../components/Footer"

import { FlagsCounter } from "../../../../components/Counter"
import { Supplier, Buyer } from "../../../../components/SearchResult"
import FlagsInfo from "../../../../components/FlagsInfo"
import KeyValue from "../../../../components/KeyValue"
import AvatarIcon from "../../../../components/AvatarIcon"
import DonutChart from "../../../../components/DonutChart"
import BarChart from "../../../../components/BarChart"
import Cta from "../../../../components/Cta"
import Partner from "../../../../components/Partner"

function Index({ tender = {}, buyers = [], suppliers = [], redflags = [] }) {
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
                    <title>{`${t("common:tender")} n. ${
                        tender["ocds:releases/0/id"]
                    } | ${t("common:title")}`}</title>
                </Head>

                <Header />

                <Container component="main" maxWidth={CONTAINER_BREAKPOINT}>
                    <Box mb={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    component="span"
                                    variant="subtitle1"
                                >
                                    {t("common:tender")}
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
                                            <AvatarIcon color="primary">
                                                <Print />
                                            </AvatarIcon>
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
                                            <AvatarIcon color="primary">
                                                <GetApp />
                                            </AvatarIcon>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h1">
                                    {tender["ocds:releases/0/tender/title"]}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FlagsCounter
                                    count={redflags.length}
                                    label={t("common:redflag", {
                                        count: redflags.length,
                                    })}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Container>

                <Box mb={2} className="band band-g">
                    <Container
                        component="section"
                        maxWidth={CONTAINER_BREAKPOINT}
                    >
                        <Typography variant="h2" color="inherit">
                            {t("common:buyers")}
                        </Typography>
                        <List>
                            {map(buyers, (buyer, index) => (
                                <Box
                                    component="li"
                                    key={buyer["ocds:releases/0/buyer/id"]}
                                >
                                    {!!index && <Divider />}
                                    <Link
                                        href="/[lang]/buyer/[id]"
                                        as={`/${lang}/buyer/${buyer["ocds:releases/0/buyer/id"]}`}
                                    >
                                        <ListItem button>
                                            <ListItemIcon>
                                                <AvatarIcon color="primary">
                                                    <ArrowForward />
                                                </AvatarIcon>
                                            </ListItemIcon>
                                            <Buyer {...buyer} />
                                        </ListItem>
                                    </Link>
                                </Box>
                            ))}
                        </List>
                    </Container>
                </Box>

                <Container component="main" maxWidth={CONTAINER_BREAKPOINT}>
                    <Box mb={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>
                                <KeyValue
                                    title={t("tender:ocds/releases/0/id")}
                                    label={tender["ocds:releases/0/id"]}
                                />
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <KeyValue
                                    title={t(
                                        "tender:ocds/releases/0/tender/contractPeriod/startDate"
                                    )}
                                    label={tf(DATE_FORMAT)(
                                        new Date(
                                            tender[
                                                "ocds:releases/0/tender/contractPeriod/startDate"
                                            ]
                                        )
                                    )}
                                />
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <KeyValue
                                    title={t(
                                        "tender:ocds/releases/0/tender/contractPeriod/endDate"
                                    )}
                                    label={tf(DATE_FORMAT)(
                                        new Date(
                                            tender[
                                                "ocds:releases/0/tender/contractPeriod/endDate"
                                            ]
                                        )
                                    )}
                                />
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <KeyValue
                                    title={t(
                                        "tender:appaltipop/releases/0/tender/participants/total"
                                    )}
                                    label={nf(INTEGER_FORMAT)(suppliers.length)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <KeyValue
                                    title={t(
                                        "tender:ocds/releases/0/tender/procurementMethodDetails"
                                    )}
                                    label={
                                        tender[
                                            "ocds:releases/0/tender/procurementMethodDetails"
                                        ]
                                    }
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <KeyValue
                                    title={t(
                                        "tender:ocds/releases/0/awards/0/value/amount"
                                    )}
                                    label={nf(CURRENCY_FORMAT)(
                                        tender[
                                            "ocds:releases/0/awards/0/value/amount"
                                        ]
                                    )}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <KeyValue
                                    title={t(
                                        "tender:ocds/releases/0/contracts/0/implementation/transactions/0/value/amount"
                                    )}
                                    label={nf(CURRENCY_FORMAT)(
                                        tender[
                                            "ocds:releases/0/contracts/0/implementation/transactions/0/value/amount"
                                        ]
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Container>

                <Box mb={8} className="band band-g">
                    <Container
                        component="section"
                        maxWidth={CONTAINER_BREAKPOINT}
                    >
                        <Typography variant="h2" color="inherit">
                            {t("common:suppliers")}
                        </Typography>
                        <List>
                            {map(suppliers, (supplier, index) => (
                                <Box
                                    component="li"
                                    key={
                                        supplier["ocds:releases/0/parties/0/id"]
                                    }
                                >
                                    {!!index && <Divider />}
                                    <Link
                                        href="/[lang]/supplier/[id]"
                                        as={`/${lang}/supplier/${supplier["ocds:releases/0/parties/0/id"]}`}
                                    >
                                        <ListItem button>
                                            <ListItemIcon>
                                                <AvatarIcon color="primary">
                                                    <ArrowForward />
                                                </AvatarIcon>
                                            </ListItemIcon>
                                            <Supplier {...supplier} />
                                        </ListItem>
                                    </Link>
                                </Box>
                            ))}
                        </List>
                    </Container>
                </Box>

                <Container component="section" maxWidth={CONTAINER_BREAKPOINT}>
                    <Box mb={8}>
                        <FlagsInfo
                            flags={map(
                                redflags,
                                "appaltipop:releases/0/redflag/code"
                            )}
                        />
                    </Box>

                    <Box mb={8}>
                        <Grid container spacing={2} justify="center">
                            <Grid item xs={6} sm={4}>
                                <Cta
                                    icon={<Avatar>FOIA</Avatar>}
                                    title={t("cta:foia.title")}
                                    href={t("cta:foia.url")}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Cta
                                    icon={
                                        <Avatar>
                                            <Sports />
                                        </Avatar>
                                    }
                                    title={t("cta:whistle.title")}
                                    href={t("cta:whistle.url")}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Container>

                {/*<Container component="section" maxWidth={CONTAINER_BREAKPOINT}>

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
                            images={["/partners/transparency-international-italy.png"]}
                            title={t("tender:monitoredBy.title")}
                            description={t("tender:monitoredBy.description")}
                        />
                    </Box>

                </Container>*/}

                <Footer />
            </>
        )
    }
}

export const getStaticProps = async (ctx) => {
    const tender = await getTenderById(ctx.params.id)
    return {
        props: {
            ...(await getI18nProps(ctx, [
                "common",
                "tender",
                "supplier",
                "redflags",
                "cta",
            ])),
            tender,
            buyers: tender["appaltipop:releases/0/buyers"] || [],
            suppliers: tender["appaltipop:releases/0/suppliers"] || [],
            redflags: tender["appaltipop:releases/0/redflags"] || [],
        },
    }
}

export const getStaticPaths = async () => ({
    paths: await getTenderPaths(),
    fallback: true,
})

export default withI18n(Index)
