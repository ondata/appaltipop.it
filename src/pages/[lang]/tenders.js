import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'
import Head from 'next/head'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import axios from 'axios'

import { map, sortBy, find, filter, keys } from 'lodash'

import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormLabel,
  TextField,
  Hidden,
  Slider
} from '@material-ui/core'

import { HighlightOff, ArrowForward, ExpandMore } from '@material-ui/icons'

import { Pagination, Autocomplete } from '@material-ui/lab'

import DateFnsUtils from '@date-io/date-fns'

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'

import { getI18nPaths, getI18nProps, withI18n } from '../../utils/i18n'

import {
  CONTAINER_BREAKPOINT,
  PAGE_SIZE,
  PERCENTAGE_FORMAT,
  INTEGER_FORMAT,
  LARGE_INTEGER_FORMAT,
  API_VERSION
} from '../../config/constants'

import { numberFormat } from '../../utils/formats'

import {
  getTendersCount,
  getRedTendersCount,
  getBuyersCount,
  getBuyers,
  getRegions,
  getRedflagsCount,
  getMinMaxAmount
} from '../../utils/queries'

import Link from '../../components/Link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AvatarIcon from '../../components/AvatarIcon'
import { Tender } from '../../components/SearchResult'
import { Card as CtaCard } from '../../components/Cta'
import { TendersCounter, BuyersCounter, FlagsCounter } from '../../components/Counter'

function Index ({
  tendersCount = 0,
  redTendersCount = 0,
  buyersCount = 0,
  redflagsCount = 0,
  largestAmount = 0,
  buyers = [],
  regions = []
}) {
  const { t, lang } = useTranslation()
  const nf = numberFormat(lang).format
  const { query: qs } = useRouter()

  const [tenders, setTenders] = useState([])

  const [resultsCount, setResultsCount] = useState(0)
  const [resultsLabel, setResultsLabel] = useState(<>&nbsp;</>)

  const [searchString, setSearchString] = useState('')
  const [buyer, setBuyer] = useState(null)
  const [region, setRegion] = useState(null)
  const [rangeAmount, setRangeAmount] = useState([0, largestAmount])
  const [minDate, setMinDate] = useState(null)
  const [maxDate, setMaxDate] = useState(null)
  const [rangeFlags, setRangeFlags] = useState([0, redflagsCount])

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    setRangeFlags([0, redflagsCount])
  }, [redflagsCount])

  useEffect(() => {
    setRangeAmount([0, largestAmount])
  }, [largestAmount])

  useEffect(() => {
    setSearchString(qs.q || '')
    setBuyer(qs.buyer ? find(buyers, buyer => buyer['ocds:releases/0/buyer/id'] === qs.buyer) : null)
    setRegion(qs.region ? find(regions, region => region['istat:COD_REG'] === qs.region) : null)
    setRangeAmount([qs.minAmount ? +qs.minAmount : 0, qs.maxAmount ? +qs.maxAmount : largestAmount])
    setMinDate(qs.minDate ? new Date(qs.minDate) : null)
    setMaxDate(qs.maxDate ? new Date(qs.maxDate) : null)
    setRangeFlags([qs.minFlags ? +qs.minFlags : 0, qs.maxFlags ? +qs.maxFlags : redflagsCount])
    setPage(qs.page ? +qs.page : 1)
    if (!location.search || keys(qs).length > 1) {
      handleRequest({ page: 1, ...qs })
    }
  }, [qs])

  function handleSubmit (e) {
    setResultsLabel(<>&nbsp;</>)
    handleRequest({ page: 1 })
    e && e.preventDefault()
  }

  function handleReset () {
    setResultsLabel(<>&nbsp;</>)
    setSearchString('')
    setBuyer(null)
    setRegion(null)
    setRangeAmount([0, largestAmount])
    setMinDate(null)
    setMaxDate(null)
    setRangeFlags([0, redflagsCount])
    setTenders([])
    setResultsCount(0)
    setPage(1)
    setPages(1)
  }

  function handleRequest (qs = {}) {
    if (!waiting) {
      setWaiting(true)
      axios
        .get(`/api/${API_VERSION}/tenders`, {
          params: {
            q: qs.q || searchString,
            buyer: qs.buyer || (buyer ? buyer['ocds:releases/0/buyer/id'] : ''),
            region: qs.region || (region ? region['istat:COD_REG'] : ''),
            minAmount: qs.minAmount || rangeAmount[0],
            maxAmount: qs.maxAmount || rangeAmount[1],
            minDate: qs.minDate || (minDate ? minDate.toISOString().split('T')[0] : ''),
            maxDate: qs.maxDate || (maxDate ? maxDate.toISOString().split('T')[0] : ''),
            minFlags: qs.minFlags || rangeFlags[0],
            maxFlags: qs.maxFlags || rangeFlags[1],
            lang: qs.lang || lang,
            page: (qs.page || page) - 1
          }
        })
        .then((res) => {
          setResultsCount(res.data.total.value)
          setTenders(map(res.data.hits, '_source'))
        })
        .finally(() => {
          setWaiting(false)
        })
    } else {
      setResultsLabel(t('search:error'))
      setTenders([])
    }
  }

  useEffect(() => {
    setResultsLabel(
      t('search:results', {
        query: searchString || '*',
        count: resultsCount,
        plus: resultsCount === 10**4 ? '+' : ''
      })
    )

    if (resultsCount) {
      setPages(
        Math.floor(resultsCount / PAGE_SIZE) + (resultsCount % PAGE_SIZE ? 1 : 0)
      )
    }
  }, [resultsCount])

  return (
    <>
      <Head>
        <title>{`${t('common:tenders')} | ${t('common:title')}`}</title>
      </Head>

      <Header />

      <main>

        <Container component='header' maxWidth={CONTAINER_BREAKPOINT}>
          <Box mb={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography component='h1' variant='subtitle1'>
                  {t('common:tenders')}
                </Typography>
                <Typography component='span' variant='h1'>
                  {t('search:title')}
                </Typography>
                <Hidden smDown>
                  <Typography component='div' variant='body2'>
                    <ReactMarkdown
                      source={t('search:description')}
                    />
                  </Typography>
                </Hidden>
              </Grid>
              <Grid item xs={4} md={2}>
                <TendersCounter
                  count={nf(INTEGER_FORMAT)(tendersCount)}
                  label={t('counter:tender', {
                    count: tendersCount
                  })}
                />
              </Grid>
              <Grid item xs={4} md={2}>
                <FlagsCounter
                  count={nf(PERCENTAGE_FORMAT)(redTendersCount / tendersCount)}
                  label={t('counter:redflag', {
                    count: redTendersCount
                  })}
                />
              </Grid>
              <Grid item xs={4} md={2}>
                <BuyersCounter
                  count={nf(INTEGER_FORMAT)(buyersCount)}
                  label={t('counter:buyer', {
                    count: buyersCount
                  })}
                />
              </Grid>
              <Hidden mdUp>
                <Grid item xs={12}>
                  <Typography component='div' variant='body2'>
                    <ReactMarkdown
                      source={t('search:description')}
                    />
                  </Typography>
                </Grid>
              </Hidden>
            </Grid>
          </Box>
        </Container>

        <Container component='header' maxWidth={CONTAINER_BREAKPOINT}>
          <Box mb={4}>
            <Grid container>
              <Grid item xs={12} md={10} lg={8}>
                <Grid container spacing={2}>
                  {
                    map(
                      t('tender:ctas', {}, { returnObjects: true }),
                      cta => (
                        <Grid item key={t(`cta:${cta}.url`)} xs={12} sm={6}>
                          <CtaCard {...t(`cta:${cta}`, {}, { returnObjects: true })} />
                        </Grid>
                      )
                    )
                  }
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>

        <Box pb={8} component='section' className='band band-g'>
          <Container maxWidth={CONTAINER_BREAKPOINT}>
            <Typography variant='h2'>
              {t('search:label')}
            </Typography>
            <Grid container>
              <Grid item xs={12} md={8}>
                <form
                  noValidate
                  autoComplete='off'
                  onSubmit={handleSubmit}
                >
                  <FormControl
                    variant='outlined'
                    fullWidth
                  >
                    <FormLabel component='label' htmlFor='search-text-field'>
                      <Typography variant='subtitle1' color='textPrimary'>
                        {t('search:text.label')}
                      </Typography>
                    </FormLabel>
                    <OutlinedInput
                      id='search-text-field'
                      placeholder={t(
                        'search:text.help'
                      )}
                      value={searchString}
                      onChange={(e) => setSearchString(e.target.value)}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label={t(
                              'common:search.reset'
                            )}
                            onClick={handleReset}
                            edge='end'
                          >
                            {waiting ? (
                              <CircularProgress />
                            ) : (
                              <HighlightOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <Typography component='p' variant='caption'>
                    {resultsLabel}
                  </Typography>
                  <Accordion elevation={0} square>
                    <AccordionSummary
                      expandIcon={
                        <ExpandMore fontSize='large' color='primary' />
                      }
                      aria-controls='filter-content'
                      id='filter-header'
                    >
                      <Typography
                        component='label'
                        variant='subtitle1'
                      >{t('search:filter')}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormControl variant='outlined'>
                            <FormLabel component='label' htmlFor='search-region-field'>
                              <Typography variant='subtitle1' color='textPrimary'>
                                {t('search:region.label')}
                              </Typography>
                            </FormLabel>
                            <Autocomplete
                              id='search-region-field'
                              fullWidth
                              autoHighlight
                              autoComplete
                              value={region}
                              onChange={(event, newValue) => setRegion(newValue)}
                              options={sortBy(regions, 'istat:COD_REG')}
                              getOptionLabel={(option) => option['ocds:releases/0/parties/address/region']}
                              renderInput={(params) => <TextField {...params} placeholder='Tutte' variant='outlined' />}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={8}>
                          <FormControl variant='outlined'>
                            <FormLabel component='label' htmlFor='search-buyer-field'>
                              <Typography variant='subtitle1' color='textPrimary'>
                                {t('search:buyer.label')}
                              </Typography>
                            </FormLabel>
                            <Autocomplete
                              id='search-buyer-field'
                              fullWidth
                              autoHighlight
                              autoComplete
                              value={!region || (buyer && buyer['istat:COD_REG'] === region['istat:COD_REG']) ? buyer : null}
                              onChange={(event, newValue) => setBuyer(newValue)}
                              options={sortBy(filter(buyers, buyer => !region || buyer['istat:COD_REG'] === region['istat:COD_REG']), 'ocds:releases/0/buyer/name')}
                              getOptionLabel={(option) => option['ocds:releases/0/buyer/name']}
                              renderInput={(params) => <TextField {...params} placeholder='Tutte' variant='outlined' />}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant='subtitle1' color='textPrimary'>
                            {t('search:rangeFlags.label')}
                          </Typography>
                          <Box mx={2}>
                            <Grid container spacing={2}>
                              <Grid item><Typography variant='body1'>{0}</Typography></Grid>
                              <Grid item xs>
                                <Slider
                                  min={0}
                                  max={redflagsCount}
                                  step={1}
                                  // valueLabelDisplay="auto"
                                  marks
                                  value={rangeFlags}
                                  onChange={(event, rangeFlags) => setRangeFlags(rangeFlags)}
                                />
                              </Grid>
                              <Grid item><Typography variant='body1'>{redflagsCount}</Typography></Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='subtitle1' color='textPrimary'>
                            {t('search:rangeAmount.label')} (&euro;)
                          </Typography>
                          <Box mx={2}>
                            <Grid container spacing={2}>
                              <Grid item><Typography variant='body1'>{nf(LARGE_INTEGER_FORMAT)(0)}</Typography></Grid>
                              <Grid item xs>
                                <Slider
                                  min={0}
                                  max={largestAmount}
                                  step={10**6}
                                  // scale={(x) => Math.exp(x)}
                                  valueLabelFormat={(value) => nf(LARGE_INTEGER_FORMAT)(value)}
                                  valueLabelDisplay='auto'
                                  value={rangeAmount}
                                  onChange={(event, rangeAmount) => setRangeAmount(rangeAmount)}
                                />
                              </Grid>
                              <Grid item><Typography variant='body1'>{nf(LARGE_INTEGER_FORMAT)(largestAmount)}+</Typography></Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <FormControl variant='outlined'>
                            <FormLabel component='label' htmlFor='search-minDate-field'>
                              <Typography variant='subtitle1' color='textPrimary'>
                                {t('search:minDate.label')}
                              </Typography>
                            </FormLabel>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                autoOk
                                // disableToolbar
                                views={['year', 'month']}
                                variant='inline'
                                inputVariant='outlined'
                                InputAdornmentProps={{ position: 'end' }}
                                format='MM/yyyy'
                                // margin="normal"
                                id='search-minDate-field'
                                label='MM/yyyy'
                                value={minDate}
                                onChange={(date) => setMinDate(date)}
                              />
                            </MuiPickersUtilsProvider>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <FormControl variant='outlined'>
                            <FormLabel component='label' htmlFor='search-maxDate-field'>
                              <Typography variant='subtitle1' color='textPrimary'>
                                {t('search:maxDate.label')}
                              </Typography>
                            </FormLabel>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                autoOk
                                // disableToolbar
                                views={['year', 'month']}
                                variant='inline'
                                inputVariant='outlined'
                                format='MM/yyyy'
                                // margin="normal"
                                id='search-minDate-field'
                                label='MM/yyyy'
                                value={maxDate}
                                onChange={(date) => setMaxDate(date)}
                              />
                            </MuiPickersUtilsProvider>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  <Box textAlign='right'>
                    <Button
                      variant='contained'
                      color='secondary'
                      disableElevation
                      type='submit'
                    >
                      {t('common:search.cta')}
                    </Button>
                  </Box>
                </form>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <Box mt={4}>

                  {pages > 1 && (
                    <Pagination
                      variant='outlined'
                      shape='rounded'
                      page={page}
                      count={pages}
                      onChange={(e, value) => {
                        setPage(value)
                        handleRequest({ page: value })
                      }}
                    />
                  )}

                  <List>
                    {map(
                      tenders,
                      (tender, index) => (
                        <Box
                          component='li'
                          key={tender[
                            'ocds:releases/0/id'
                          ]}
                        >
                          {!!index && (
                            <Divider />
                          )}
                          <Link
                            href='/tender/[id]'
                            as={`/tender/${tender['ocds:releases/0/id']}`}
                            passHref
                          >
                            <ListItem
                              component='a'
                              button
                            >
                              <ListItemIcon>
                                <AvatarIcon color='primary'>
                                  <ArrowForward />
                                </AvatarIcon>
                              </ListItemIcon>
                              <Tender
                                {...tender}
                              />
                            </ListItem>
                          </Link>
                        </Box>
                      )
                    )}
                  </List>

                  {pages > 1 && (
                    <Pagination
                      variant='outlined'
                      shape='rounded'
                      page={page}
                      count={pages}
                      onChange={(e, value) => {
                        setPage(value)
                        handleRequest({ page: value })
                      }}
                    />
                  )}

                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </main>

      <Footer />
    </>
  )
}

export const getStaticProps = async (ctx) => {
  return {
    props: {
      ...(await getI18nProps(ctx, ['common', 'tender', 'search', 'counter', 'cta'])),
      tendersCount: await getTendersCount(),
      redTendersCount: await getRedTendersCount(),
      buyersCount: await getBuyersCount(),
      redflagsCount: await getRedflagsCount(),
      largestAmount: (await getMinMaxAmount())[1],
      buyers: map((await getBuyers()).hits, '_source'),
      regions: map((await getRegions()).hits, '_source')
    },
    unstable_revalidate: 3600
  }
}

export const getStaticPaths = async () => ({
  paths: getI18nPaths(),
  fallback: false
})

export default withI18n(Index)
