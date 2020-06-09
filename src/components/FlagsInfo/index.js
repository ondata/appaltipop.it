import Link from "next/link"

import useTranslation from "next-translate/useTranslation"

import { map, range, padStart, includes } from "lodash"

import {
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Box,
} from "@material-ui/core"

import { makeStyles } from "@material-ui/core/styles"

import { Flag, ArrowDropDownCircleOutlined } from "@material-ui/icons"

import style from "./style"
const useStyles = makeStyles(style)

export default function Index({ flags = [] }) {
    const classes = useStyles()
    const { t, lang } = useTranslation()

    const [expanded, setExpanded] = React.useState(flags[0])

    return (
        <>
            {map(
                flags, //map(range(1,+t("redflags:flags")+1), redflag => padStart(redflag,2,0)),
                (flag) => (
                    <ExpansionPanel
                        elevation={0}
                        key={flag}
                        expanded={expanded === flag}
                        onChange={(e, isExpanded) =>
                            setExpanded(isExpanded ? flag : false)
                        }
                    >
                        <ExpansionPanelSummary
                            className={classes.panel}
                            expandIcon={
                                <ArrowDropDownCircleOutlined color="primary" />
                            }
                            aria-controls={`panel${flag}-content`}
                            id={`panel${flag}-header`}
                        >
                            <Box mr={2}>
                                <Flag
                                    color={
                                        includes(flags, flag)
                                            ? "error"
                                            : "disabled"
                                    }
                                    fontSize="large"
                                    className={classes.icon}
                                />
                            </Box>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    className={classes.title}
                                >
                                    {t(`redflags:${flag}.title`)}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className={classes.summary}
                                >
                                    {t(`redflags:${flag}.summary`)}
                                </Typography>
                            </Box>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography
                                variant="body2"
                                className={classes.description}
                            >
                                {t(`redflags:${flag}.description`)}
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )
            )}
        </>
    )
}
