import Link from 'next/link'
import { useRouter } from 'next/router'

import {
    Typography,
    Container,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index({
    title = "",
}) {
    const router = useRouter()
    const classes = useStyles()
    return (
        <Container component="header" maxWidth="sm" className={classes.root}>
            <Typography variant="h1" className="title" align="center">
                {title}
            </Typography>
        </Container>
    )
}
