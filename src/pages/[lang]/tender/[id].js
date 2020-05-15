import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useTranslation from 'next-translate/useTranslation'

import { map } from 'lodash'

import { getI18nProps, withI18n } from '../../../utils/i18n'

import { getTenderById } from '../../../utils/queries'
import { getTenderPaths } from '../../../utils/paths'

import Footer from '../../../components/Footer'

function Index({ tender, buyers, suppliers }) {

    const router = useRouter()
    const { t, lang } = useTranslation()

    if (router.isFallback) {
        return <div>Loading...</div>
    } else {
        return (
            <div className="container">
                <Head>
                    <title>{t("common:title")}</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main>

                    <h1 className="title">
                        {t("common:title")}
                    </h1>

                    <h2>{t("common:tender")}</h2>

                    <p>{tender["appalto"]} ({tender["cig"]})</p>

                    <h2>{t("common:buyers")}</h2>

                    <ul>
                        {
                            map(
                                buyers,
                                buyer => (
                                    <li key={buyer["ID"]}>
                                        (<Link href="/[lang]/buyer/[id]" as={`/${lang}/buyer/${buyer["ID"]}`}>
                                            <a>
                                                {buyer["ID"]}
                                            </a>
                                        </Link>)
                                        {` `}
                                        {buyer["denominazione"]}
                                    </li>
                                )
                            )
                        }
                        <li>...</li>
                    </ul>

                    <h2>{t("common:suppliers")}</h2>

                    <ul>
                        {
                            map(
                                suppliers,
                                supplier => (
                                    <li key={supplier["CF"]}>
                                        (<Link href="/[lang]/supplier/[id]" as={`/${lang}/supplier/${supplier["CF"]}`}>
                                            <a>
                                                {supplier["CF"]}
                                            </a>
                                        </Link>)
                                        {` `}
                                        {supplier["ragione sociale"]}
                                    </li>
                                )
                            )
                        }
                        <li>...</li>
                    </ul>

                </main>

                <Footer />

                <style jsx>{`
                    .container {
                    min-height: 100vh;
                    padding: 0 0.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    }

                    main {
                    padding: 5rem 0;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    }

                    .title a {
                    color: #0070f3;
                    text-decoration: none;
                    }

                    .title a:hover,
                    .title a:focus,
                    .title a:active {
                    text-decoration: underline;
                    }

                    .title {
                    margin: 0;
                    line-height: 1.15;
                    font-size: 4rem;
                    }

                    .title,
                    .description {
                    text-align: center;
                    }

                    .description {
                    line-height: 1.5;
                    font-size: 1.5rem;
                    }

                    code {
                    background: #fafafa;
                    border-radius: 5px;
                    padding: 0.75rem;
                    font-size: 1.1rem;
                    font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
                        DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
                    }

                    .grid {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;

                    max-width: 800px;
                    margin-top: 3rem;
                    }

                    .card {
                    margin: 1rem;
                    flex-basis: 45%;
                    padding: 1.5rem;
                    text-align: left;
                    color: inherit;
                    text-decoration: none;
                    border: 1px solid #eaeaea;
                    border-radius: 10px;
                    transition: color 0.15s ease, border-color 0.15s ease;
                    }

                    .card:hover,
                    .card:focus,
                    .card:active {
                    color: #0070f3;
                    border-color: #0070f3;
                    }

                    .card h3 {
                    margin: 0 0 1rem 0;
                    font-size: 1.5rem;
                    }

                    .card p {
                    margin: 0;
                    font-size: 1.25rem;
                    line-height: 1.5;
                    }

                    .logo {
                    height: 1em;
                    }

                    @media (max-width: 600px) {
                    .grid {
                        width: 100%;
                        flex-direction: column;
                    }
                    }
                `}</style>

                <style jsx global>{`
                    html,
                    body {
                    padding: 0;
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                        Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                        sans-serif;
                    }

                    * {
                    box-sizing: border-box;
                    }
                `}</style>

            </div>
        )
    }
}

export const getStaticProps = async ctx => {
    const tender = await getTenderById(ctx.params.id)
    return {
        props: {
            ...(await getI18nProps(ctx, ['common','supplier'])),
            tender,
            buyers: tender["pubblica amministrazione proponente"],
            suppliers: tender["aggiudicatari"],
        }
    }
}

export const getStaticPaths = async () => ({
    paths: await getTenderPaths(),
    fallback: true,
})

export default withI18n(Index)
