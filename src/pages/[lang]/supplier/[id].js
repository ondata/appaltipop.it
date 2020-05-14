import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useTranslation from 'next-translate/useTranslation'

import { map } from 'lodash'

import { getI18nProps, withI18n } from '../../../utils/i18n'

import { getSupplierById, getTendersBySupplier } from '../../../utils/queries'
import { getSupplierPaths } from '../../../utils/paths'

function Index({ supplier, tenders }) {

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

                    <h2>{t("common:supplier")}</h2>

                    <p>{supplier["ragione sociale"]} ({supplier["CF"]})</p>

                    <h2>{t("common:tenders")}</h2>

                    <ul>
                        {
                            map(
                                tenders,
                                tender => (
                                    <li key={tender["cig"]}>
                                        (<Link href="/[lang]/tender/[id]" as={`/${lang}/tender/${tender["cig"]}`}>
                                            <a>
                                                {tender["cig"]}
                                            </a>
                                        </Link>)
                                        {` `}
                                        {tender["appalto"]}
                                    </li>
                                )
                            )
                        }
                        <li>...</li>
                    </ul>

                </main>

                <footer>
                    Powered by Ondata
                </footer>

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

                    footer {
                    width: 100%;
                    height: 100px;
                    border-top: 1px solid #eaeaea;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    }

                    footer img {
                    margin-left: 0.5rem;
                    }

                    footer a {
                    display: flex;
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

export const getStaticProps = async ctx => ({
    props: {
        ...(await getI18nProps(ctx, ['common','supplier'])),
        supplier: await getSupplierById(ctx.params.id),
        tenders: await getTendersBySupplier(ctx.params.id),
    }
})

export const getStaticPaths = async () => ({
    paths: await getSupplierPaths(),
    fallback: true,
})

export default withI18n(Index)
