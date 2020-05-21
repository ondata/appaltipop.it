import Link from 'next/link'

import useTranslation from 'next-translate/useTranslation'

import {
    map,
    includes,
} from 'lodash'

import {
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Box,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import {
    Flag,
    LiveHelpOutlined,
} from '@material-ui/icons'

import { REDFLAGS } from '../../config/constants'

import style from './style'
const useStyles = makeStyles(style)

export default function Index({
    flags = [],
}) {

    const classes = useStyles()
    const { t, lang } = useTranslation()

    const [ expanded, setExpanded ] = React.useState(flags[0]);

    return (
        <>
            {
                map(
                    REDFLAGS,
                    redflag => (
                        <ExpansionPanel key={redflag} expanded={expanded === redflag} onChange={(e, isExpanded) => setExpanded(isExpanded ? redflag : false)}>
                            <ExpansionPanelSummary
                                className={classes.panel}
                                expandIcon={<LiveHelpOutlined />}
                                aria-controls={`panel${redflag}-content`}
                                id={`panel${redflag}-header`}
                            >
                                <Box mr={2}>
                                    <Flag color={includes(flags, redflag) ? "error" : "disabled"} fontSize="large" className={classes.icon} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" className={classes.title}>{t(`redflags:${redflag}.title`)}</Typography>
                                    <Typography variant="body2" className={classes.summary}>{t(`redflags:${redflag}.summary`)}</Typography>
                                </Box>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Typography variant="body1" className={classes.description}>
                                    {t(`redflags:${redflag}.description`)}
                                </Typography>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    )
                )
            }
        </>
    )
}
