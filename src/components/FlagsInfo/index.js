import { useState } from 'react'

import useTranslation from 'next-translate/useTranslation'

import { map, includes } from 'lodash'

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import { Flag, ExpandMore } from '@material-ui/icons'

import style from './style'
const useStyles = makeStyles(style)

export default function Index ({ flags = [] }) {
  const classes = useStyles()
  const { t } = useTranslation()

  const [expanded, setExpanded] = useState(flags[0])

  return (
    <>
      {map(
        flags, // map(range(1,+t("redflags:flags")+1), redflag => padStart(redflag,2,0)),
        (flag) => (
          <Accordion
            className={classes.root}
            elevation={0}
            key={flag}
            expanded={expanded === flag}
            onChange={(e, isExpanded) =>
              setExpanded(isExpanded ? flag : false)}
          >
            <AccordionSummary
              className={classes.panel}
              expandIcon={
                <ExpandMore fontSize='large' color='primary' />
              }
              aria-controls={`panel${flag}-content`}
              id={`panel${flag}-header`}
            >
              <Box mr={2}>
                <Flag
                  color={
                    includes(flags, flag)
                      ? 'error'
                      : 'disabled'
                  }
                  fontSize='large'
                  className={classes.icon}
                />
              </Box>
              <Box>
                <Typography
                  variant='subtitle2'
                  className={classes.title}
                >
                  {t(`redflags:${flag}.title`)}
                </Typography>
                <Typography
                  variant='body1'
                  className={classes.summary}
                >
                  {t(`redflags:${flag}.summary`)}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails
              className={classes.details}
            >
              <Typography
                variant='body2'
                className={classes.description}
              >
                {t(`redflags:${flag}.description`)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )
      )}
    </>
  )
}
