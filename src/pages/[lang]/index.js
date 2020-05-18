import Head from 'next/head'
import Link from 'next/link'

import useTranslation from 'next-translate/useTranslation'

import {
    Container,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@material-ui/core'

import { getI18nPaths, getI18nProps, withI18n } from '../../utils/i18n'

import { getTenderCounts, getBuyerCounts, getSupplierCounts } from '../../utils/queries'

import Footer from '../../components/Footer'
import Header from '../../components/Header'

function Index({ tenders, buyers, suppliers }) {

    const { t, lang } = useTranslation()

    return (
        <>

            <Head>
                <title>{t("common:title")}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header title={t("common:title")} />

            <Container component="main" maxWidth="md">

                <List component="nav">
                    <Link href="/[lang]/tenders" as={`/${lang}/tenders`}>
                        <ListItem button component="a">
                            <ListItemText primary={t("common:tenders")} />
                            <ListItemSecondaryAction>{tenders}</ListItemSecondaryAction>
                        </ListItem>
                    </Link>
                    <Link href="/[lang]/buyers" as={`/${lang}/buyers`}>
                        <ListItem button component="a">
                            <ListItemText primary={t("common:buyers")} />
                            <ListItemSecondaryAction>{buyers}</ListItemSecondaryAction>
                        </ListItem>
                    </Link>
                    <Link href="/[lang]/suppliers" as={`/${lang}/suppliers`}>
                        <ListItem button component="a">
                            <ListItemText primary={t("common:suppliers")} />
                            <ListItemSecondaryAction>{suppliers}</ListItemSecondaryAction>
                        </ListItem>
                    </Link>
                </List>
                
            </Container>

            <Footer lang={lang} />

        </>
    )
}

export const getStaticProps = async (ctx) => ({
    props: {
        ...(await getI18nProps(ctx, ['common'])),
        tenders: await getTenderCounts(),
        buyers: await getBuyerCounts(),
        suppliers: await getSupplierCounts(),
    }
})

export const getStaticPaths = async () => ({
    paths: getI18nPaths(),
    fallback: false,
})

export default withI18n(Index)
