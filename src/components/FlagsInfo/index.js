import { useState } from 'react'

import useTranslation from 'next-translate/useTranslation'

import { map, includes, isEmpty } from 'lodash'

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

  const [expanded, setExpanded] = useState(flags[0]['appaltipop:releases/0/redflag/code'])

  return (
    <>
      {map(
        flags, // map(range(1,+t("redflags:flags")+1), redflag => padStart(redflag,2,0)),
        (flag) => {
          const id = flag['appaltipop:releases/0/redflag/code']
          const title = t(
            `redflags:${id}.title`,
            {},
            { returnObjects: true }
          )
          const summary = t(
            `redflags:${id}.summary`,
            {},
            { returnObjects: true }
          )
          const description = t(
            `redflags:${id}.description`,
            {},
            { returnObjects: true }
          )

          return (
            <Accordion
              className={classes.root}
              elevation={0}
              key={id}
              expanded={expanded === id}
              onChange={(e, isExpanded) => setExpanded(isExpanded ? id : false)}
            >
              <AccordionSummary
                className={classes.panel}
                expandIcon={
                  <ExpandMore fontSize='large' color='primary' />
                }
                aria-controls={`panel${id}-content`}
                id={`panel${id}-header`}
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
                    {isEmpty(title) ? `${t('common:redflag')} ${id}` : title}
                  </Typography>
                  <Typography
                    variant='body1'
                    className={classes.summary}
                  >
                    {isEmpty(summary) ? ' ' : summary}
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
                  {isEmpty(description) ? flag['appaltipop:releases/0/redflag/description'] : description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )
        }
      )}
    </>
  )
}
