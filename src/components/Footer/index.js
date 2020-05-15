import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Index() {
    const router = useRouter()
    return (
        <>

            <footer>
                <p>
                    <Link href="/[lang]" as={`/${router.query.lang}`}><a>Home</a></Link>
                    {` | `}
                    <Link href={router.route} as={router.asPath.replace(`/${router.query.lang}`,"/it")}><a>Italiano</a></Link>
                    {` | `}
                    <Link href={router.route} as={router.asPath.replace(`/${router.query.lang}`,"/en")}><a>English</a></Link>
                </p>
                <p>Powered by Ondata</p>
            </footer>

            <style jsx>{`
            footer {
            width: 100%;
            height: 100px;
            border-top: 1px solid #eaeaea;
            text-align: center;
            }

            footer img {
            margin-left: 0.5rem;
            }
            `}</style>

        </>
    )
}