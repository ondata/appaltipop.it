import Link from 'next/link'

import useTranslation from 'next-translate/useTranslation'

import {
    Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index({
    title = "",
    label = "",
    href = "",
    as = "",
}) {

    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <>

            {
                !!title
                &&
                <Typography variant="subtitle2">
                    {title}
                </Typography>
            }

            <Typography variant="body2">
                {
                    !!as && !!href
                    ?
                    <Link href={href} as={as}>
                        <a>{label || "-"}</a>
                    </Link>
                    :
                    label || "-"
                }
            </Typography>

        </>
    )
}
