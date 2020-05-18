import Link from 'next/link'
import { useRouter } from 'next/router'

import {
    Typography,
    Container,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index() {
    const router = useRouter()
    const classes = useStyles()
    return (
        <Container component="footer" maxWidth="sm" className={classes.root}>
            <Typography align="center">
                <Link href="/[lang]" as={`/${router.query.lang}`}><a>Home</a></Link>
                {` | `}
                <Link href={router.route} as={router.asPath.replace(`/${router.query.lang}`,"/it")}><a>Italiano</a></Link>
                {` | `}
                <Link href={router.route} as={router.asPath.replace(`/${router.query.lang}`,"/en")}><a>English</a></Link>
            </Typography>
            <Typography align="center">
                Powered by Ondata
            </Typography>
        </Container>
    )
}
