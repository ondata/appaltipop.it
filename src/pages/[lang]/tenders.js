import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'
import Head from 'next/head'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import axios from 'axios'

import { map, sortBy, find, filter, keys } from 'lodash'

import { CopyToClipboard } from 'react-copy-to-clipboard'

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
  Slider,
  Tooltip
} from '@material-ui/core'

import { HighlightOff, ArrowForward, ExpandMore, Link as LinkIcon } from '@material-ui/icons'

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
  getMinMaxAmount,
  getTenderMethods
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
  regions = [],
  methods = []
}) {
  const { t, lang } = useTranslation()
  const nf = numberFormat(lang).format
  const { query, push } = useRouter()

  const [tenders, setTenders] = useState([])

  const [resultsCount, setResultsCount] = useState(0)
  const [resultsLabel, setResultsLabel] = useState(<>&nbsp;</>)

  const [searchString, setSearchString] = useState('')
  const [buyer, setBuyer] = useState(null)
  const [region, setRegion] = useState(null)
  const [method, setMethod] = useState(null)
  const [rangeAmount, setRangeAmount] = useState([0, Math.ceil(Math.log10(largestAmount))])
  const [minDate, setMinDate] = useState(null)
  const [maxDate, setMaxDate] = useState(null)
  const [rangeFlags, setRangeFlags] = useState([0, redflagsCount])

  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)

  const [permalink, setPermalink] = useState('')
  const [copied, setCopied] = useState(false)

  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    setRangeFlags([0, redflagsCount])
  }, [redflagsCount])

  useEffect(() => {
    setRangeAmount([0, largestAmount])
  }, [largestAmount])

  useEffect(() => {
    setSearchString(query.q || searchString)
    setBuyer(query.buyer ? find(buyers, buyer => buyer['ocds:releases/0/buyer/id'] === query.buyer) : buyer)
    setRegion(query.region ? find(regions, region => region['istat:COD_REG'] === query.region) : region)
    setMethod(query.method || method)
    setRangeAmount(query.minAmount || query.maxAmount ? [query.minAmount ? Math.ceil(Math.log10(Math.max(+query.minAmount, 1))) : 0, query.maxAmount ? Math.ceil(Math.log10(+query.maxAmount)) : Math.ceil(Math.log10(largestAmount))] : rangeAmount)
    setMinDate(query.minDate ? new Date(query.minDate) : minDate)
    setMaxDate(query.maxDate ? new Date(query.maxDate) : maxDate)
    setRangeFlags(query.minFlags || query.maxFlags ? [query.minFlags ? +query.minFlags : 0, query.maxFlags ? +query.maxFlags : redflagsCount] : rangeFlags)
    setPage(query.page ? +query.page : page)
    setPermalink(`${location.origin}${location.pathname}?${(new URLSearchParams(query)).toString()}`)
    setCopied(false)
    if (!location.search || keys(query).length > 1) {
      handleRequest({ page: 0, ...query })
    }
  }, [query])

  function handleSubmit (e) {
    const query = {
      lang: lang,
      q: searchString,
      buyer: buyer ? buyer['ocds:releases/0/buyer/id'] : '',
      region: region ? region['istat:COD_REG'] : '',
      method: method,
      minAmount: 10 ** rangeAmount[0],
      maxAmount: 10 ** rangeAmount[1],
      minDate: minDate ? minDate.toISOString().split('T')[0] : '',
      maxDate: maxDate ? maxDate.toISOString().split('T')[0] : '',
      minFlags: rangeFlags[0],
      maxFlags: rangeFlags[1],
      page: e?.page || 0
    }

    push(
      {
        pathname: '/[lang]/tenders',
        query
      },
      {
        pathname: `/${lang}/tenders`,
        query
      },
      { shallow: true }
    )

    setResultsLabel(<>&nbsp;</>)
    e?.preventDefault?.()
  }

  function handleReset () {
    setResultsLabel(<>&nbsp;</>)
    setSearchString('')
    setBuyer(null)
    setRegion(null)
    setMethod(null)
    setRangeAmount([0, Math.ceil(Math.log10(largestAmount))])
    setMinDate(null)
    setMaxDate(null)
    setRangeFlags([0, redflagsCount])
    setTenders([])
    setResultsCount(0)
    setPage(0)
    setPages(1)
  }

  function handleRequest (query = {}) {
    if (!waiting) {
      setWaiting(true)
      axios
        .get(`/api/${API_VERSION}/tenders`, {
          params: {
            lang: query.lang || lang,
            q: query.q || searchString,
            buyer: query.buyer || (buyer ? buyer['ocds:releases/0/buyer/id'] : ''),
            region: query.region || (region ? region['istat:COD_REG'] : ''),
            method: query.method || method,
            minAmount: query.minAmount || 10 ** rangeAmount[0],
            maxAmount: query.maxAmount || 10 ** rangeAmount[1],
            minDate: query.minDate || (minDate ? minDate.toISOString().split('T')[0] : ''),
            maxDate: query.maxDate || (maxDate ? maxDate.toISOString().split('T')[0] : ''),
            minFlags: query.minFlags || rangeFlags[0],
            maxFlags: query.maxFlags || rangeFlags[1],
            page: query.page || page
          }
        })
        .then((res) => {
          setResultsCount(res.data.total.value)
          setTenders(map(res.data.hits, '_source'))
        })
        .finally(() => {
          setWaiting(false)
        })
    }
  }

  useEffect(() => {
    setResultsLabel(
      t('search:results', {
        query: searchString || '*',
        count: resultsCount,
        plus: resultsCount === 10 ** 4 ? '+' : ''
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
                          <CtaCard noMargins {...t(`cta:${cta}`, {}, { returnObjects: true })} />
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
                        <Grid item xs={8}>
                          <Typography variant='subtitle1' color='textPrimary'>
                            {t('search:rangeAmount.label')} (&euro;)
                          </Typography>
                          <Box mx={1}>
                            <Grid container spacing={2}>
                              <Grid item><Typography variant='body1'>{nf(LARGE_INTEGER_FORMAT)(0)}</Typography></Grid>
                              <Grid item xs>
                                <Slider
                                  min={0}
                                  max={Math.ceil(Math.log10(largestAmount))}
                                  step={1}
                                  marks
                                  scale={(x) => 10 ** x}
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
                        <Grid item xs={4}>
                          <Typography variant='subtitle1' color='textPrimary'>
                            {t('search:rangeFlags.label')}
                          </Typography>
                          <Box mx={1}>
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
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormControl variant='outlined'>
                            <FormLabel component='label' htmlFor='search-method-field'>
                              <Typography variant='subtitle1' color='textPrimary'>
                                {t('search:method.label')}
                              </Typography>
                            </FormLabel>
                            <Autocomplete
                              id='search-method-field'
                              fullWidth
                              autoHighlight
                              autoComplete
                              value={method}
                              onChange={(event, newValue) => setMethod(newValue)}
                              options={methods}
                              //getOptionLabel={(option) => option['ocds:releases/0/parties/address/region']}
                              renderInput={(params) => <TextField {...params} placeholder='Tutte' variant='outlined' />}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={3}>
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
                        <Grid item xs={3}>
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
                      size='large'
                      type='submit'
                    >
                      {t('common:search.cta')}
                    </Button>
                    <Tooltip
                      title={t('search:copy')}
                    >
                      <CopyToClipboard
                        text={permalink}
                        onCopy={() => setCopied(true)}
                      >
                        <IconButton
                          color='primary'
                        >
                          <LinkIcon />
                        </IconButton>
                      </CopyToClipboard>
                    </Tooltip>
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
                      page={page+1}
                      count={pages}
                      onChange={(e, value) => {
                        setPage(value-1)
                        handleSubmit({ page: value-1 })
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
                      page={page+1}
                      count={pages}
                      onChange={(e, value) => {
                        setPage(value-1)
                        handleSubmit({ page: value-1 })
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
      regions: map((await getRegions()).hits, '_source'),
      methods: map((await getTenderMethods()).buckets, 'key')
    },
    unstable_revalidate: 3600
  }
}

export const getStaticPaths = async () => ({
  paths: getI18nPaths(),
  fallback: false
})

export default withI18n(Index)
