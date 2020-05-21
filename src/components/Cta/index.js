import useTranslation from 'next-translate/useTranslation'

import {
    Button,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import style from './style'
const useStyles = makeStyles(style)

export default function Index({
    icon = "",
    title = "",
    href = "",
}) {

    const classes = useStyles()
    const { t, lang } = useTranslation()

    return (
        <Button
            variant="outlined"
            startIcon={icon}
            target="_blank"
            href={href}
        >
            {title}
        </Button>
    )
}
