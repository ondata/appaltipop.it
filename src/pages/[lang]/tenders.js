import { useState, useEffect } from 'react'

import Head from 'next/head'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import axios from 'axios'

import { map, sortBy, range } from 'lodash'

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
  Hidden
} from '@material-ui/core'

import { HighlightOff, ArrowForward, ExpandMore } from '@material-ui/icons'

import { Pagination, Autocomplete } from '@material-ui/lab'

import DateFnsUtils from '@date-io/date-fns'

import {
  MuiPickersUtilsProvider,
  DatePicker
} from '@material-ui/pickers'

import { getI18nPaths, getI18nProps, withI18n } from '../../utils/i18n'

import {
  CONTAINER_BREAKPOINT,
  PAGE_SIZE,
  API_VERSION
} from '../../config/constants'

import {
  getTendersCount,
  getRedTendersCount,
  getBuyersCount,
  getBuyers,
  getRegions,
  getRedflagsCount
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
  buyers = [],
  regions = []
}) {
  const { t, lang } = useTranslation()

  const [tenders, setTenders] = useState([])

  const [results, setResults] = useState(0)
  const [resultsLabel, setResultsLabel] = useState(<>&nbsp;</>)

  const [searchString, setSearchString] = useState('')
  const [currentSearchString, setCurrentSearchString] = useState('')

  const [buyer, setBuyer] = useState(null)
  const [currentBuyer, setCurrentBuyer] = useState(null)

  const [region, setRegion] = useState(null)
  const [currentRegion, setCurrentRegion] = useState(null)

  const [minAmount, setMinAmount] = useState(0)
  const [currentMinAmount, setCurrentMinAmount] = useState(0)

  const [maxAmount, setMaxAmount] = useState(0)
  const [currentMaxAmount, setCurrentMaxAmount] = useState(0)

  const [minDate, setMinDate] = useState(null)
  const [currentMinDate, setCurrentMinDate] = useState(null)

  const [maxDate, setMaxDate] = useState(null)
  const [currentMaxDate, setCurrentMaxDate] = useState(null)

  const [minFlags, setMinFlags] = useState(0)
  const [currentMinFlags, setCurrentMinFlags] = useState(0)

  const [maxFlags, setMaxFlags] = useState(0)
  const [currentMaxFlags, setCurrentMaxFlags] = useState(0)

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const [waiting, setWaiting] = useState(false)

  function handleSubmit (e) {
    setResultsLabel(<>&nbsp;</>)
    setCurrentSearchString(searchString)
    setCurrentBuyer(buyer)
    setCurrentRegion(region)
    setCurrentMinAmount(minAmount)
    setCurrentMaxAmount(maxAmount)
    setCurrentMinDate(minDate)
    setCurrentMaxDate(maxDate)
    setCurrentMinFlags(minFlags)
    setCurrentMaxFlags(maxFlags)
    e.preventDefault()
  }

  function handleReset () {
    setResultsLabel(<>&nbsp;</>)
    setSearchString('')
    setBuyer(null)
    setRegion(null)
    setMinAmount(0)
    setMaxAmount(0)
    setMinDate(null)
    setMaxDate(null)
    setMinFlags(0)
    setMaxFlags(0)
    setTenders([])
    setResults(0)
    setPage(1)
    setCurrentSearchString('')
    setCurrentBuyer(null)
    setCurrentRegion(null)
    setCurrentMinAmount(0)
    setCurrentMaxAmount(0)
    setCurrentMinDate(null)
    setCurrentMaxDate(null)
    setCurrentMinFlags(0)
    setCurrentMaxFlags(0)
  }

  function handleChangePage (e, value) {
    setPage(value)
  }

  function handleRequest () {
    if (currentSearchString) {
      setWaiting(true)
      axios
        .get(`/api/${API_VERSION}/tenders`, {
          params: {
            q: currentSearchString,
            buyer: currentBuyer ? currentBuyer['ocds:releases/0/buyer/id'] : '',
            region: currentRegion ? currentRegion['istat:COD_REG'] : '',
            minAmount: currentMinAmount,
            maxAmount: currentMaxAmount,
            minDate: currentMinDate ? currentMinDate.toISOString().split('T')[0] : '',
            maxDate: currentMaxDate ? currentMaxDate.toISOString().split('T')[0] : '',
            minFlags: currentMinFlags,
            maxFlags: currentMaxFlags,
            lang,
            page: page - 1
          }
        })
        .then((res) => {
          setResults(res.data.total.value)
          setTenders(map(res.data.hits, '_source'))
          setWaiting(false)
        })
    } else {
      setResultsLabel(t('search:error'))
      setTenders([])
    }
  }

  useEffect(
    () => {
      setResults(0)
      setPage(0)
    },
    [
      currentSearchString,
      currentBuyer,
      currentRegion,
      currentMinAmount,
      currentMaxAmount,
      currentMinDate,
      currentMaxDate,
      currentMinFlags,
      currentMaxFlags
    ]
  )

  useEffect(() => {
    if (page) {
      handleRequest()
    } else {
      setPage(1)
    }
  }, [page])

  useEffect(() => {
    setResultsLabel(
      t('search:results', {
        query: currentSearchString,
        count: results
      })
    )

    if (results) {
      setPages(
        Math.floor(results / PAGE_SIZE) + (results % PAGE_SIZE ? 1 : 0)
      )
    }
  }, [results])

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
                  count={tendersCount}
                  label={t('counter:tender', {
                    count: tendersCount
                  })}
                />
              </Grid>
              <Grid item xs={4} md={2}>
                <FlagsCounter
                  count={`${Math.round(
                    (redTendersCount / tendersCount) * 100
                  )}%`}
                  label={t('counter:redflag', {
                    count: redTendersCount
                  })}
                />
              </Grid>
              <Grid item xs={4} md={2}>
                <BuyersCounter
                  count={buyersCount}
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
            <Grid container>
              <Grid item xs={12} sm={8}>
                <form
                  noValidate
                  autoComplete='off'
                  onSubmit={handleSubmit}
                >
                  <Grid container spacing={2} alignItems='flex-end'>
                    <Grid item xs={10}>
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
                          endAdornment={!!searchString && (
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
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControl
                        variant='outlined'
                        fullWidth
                      >
                        <Button
                          variant='contained'
                          color='secondary'
                          disableElevation
                          type='submit'
                          style={{ height: '100%' }}
                        >
                          {t('common:search.cta')}
                        </Button>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography component='p' variant='caption'>
                        {currentSearchString ? (
                          resultsLabel
                        ) : (
                          <>&nbsp;</>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Accordion elevation={0} square>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
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
                        <Grid item xs={6}>
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
                              value={buyer}
                              onChange={(event, newValue) => setBuyer(newValue)}
                              options={sortBy(buyers, 'ocds:releases/0/buyer/name')}
                              getOptionLabel={(option) => option['ocds:releases/0/buyer/name']}
                              renderInput={(params) => <TextField {...params} placeholder='Tutte' variant='outlined' />}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
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
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormControl variant='outlined'>
                            <FormLabel component='label' htmlFor='search-minAmount-field'>
                              <Typography variant='subtitle1' color='textPrimary'>
                                {t('search:minAmount.label')}
                              </Typography>
                            </FormLabel>
                            <TextField
                              id='search-minAmount-field'
                              variant='outlined'
                              type='number'
                              value={minAmount}
                              onChange={(event) => setMinAmount(+event.target.value)}
                              inputProps={{
                                min: 0,
                                step: 1000
                              }}
                              InputProps={{
                                startAdornment: <InputAdornment position='start'>&euro;</InputAdornment>
                              }}
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl variant='outlined'>
                            <FormLabel component='label' htmlFor='search-maxAmount-field'>
                              <Typography variant='subtitle1' color='textPrimary'>
                                {t('search:maxAmount.label')}
                              </Typography>
                            </FormLabel>
                            <TextField
                              id='search-maxAmount-field'
                              variant='outlined'
                              type='number'
                              value={maxAmount}
                              onChange={(event) => setMaxAmount(+event.target.value)}
                              inputProps={{
                                min: 0,
                                step: 1000
                              }}
                              InputProps={{
                                startAdornment: <InputAdornment position='start'>&euro;</InputAdornment>
                              }}
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormControl variant='outlined'>
                            <FormLabel component='label' htmlFor='search-minDate-field'>
                              <Typography variant='subtitle1' color='textPrimary'>
                                {t('search:minDate.label')}
                              </Typography>
                            </FormLabel>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <DatePicker
                                autoOk
                                disableToolbar
                                views={['year', 'month']}
                                variant='inline'
                                inputVariant='outlined'
                                // format="MM/yyyy"
                                // margin="normal"
                                id='search-minDate-field'
                                // label="Date picker inline"
                                value={minDate}
                                onChange={(date) => setMinDate(date)}
                              />
                            </MuiPickersUtilsProvider>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl variant='outlined'>
                            <FormLabel component='label' htmlFor='search-maxDate-field'>
                              <Typography variant='subtitle1' color='textPrimary'>
                                {t('search:maxDate.label')}
                              </Typography>
                            </FormLabel>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <DatePicker
                                autoOk
                                disableToolbar
                                views={['year', 'month']}
                                variant='inline'
                                inputVariant='outlined'
                                // format="MM/yyyy"
                                // margin="normal"
                                id='search-minDate-field'
                                // label="Date picker inline"
                                value={maxDate}
                                onChange={(date) => setMaxDate(date)}
                              />
                            </MuiPickersUtilsProvider>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormControl variant='outlined'>
                            <FormLabel component='label' htmlFor='search-minFlags-field'>
                              <Typography variant='subtitle1' color='textPrimary'>
                                {t('search:minFlags.label')}
                              </Typography>
                            </FormLabel>
                            <TextField
                              id='search-minFlags-field'
                              select
                              // label="Native select"
                              value={minFlags}
                              onChange={(event) => setMinFlags(+event.target.value)}
                              SelectProps={{
                                native: true
                              }}
                              // helperText="Please select your currency"
                              variant='outlined'
                            >
                              {
                                map(
                                  range(redflagsCount + 1),
                                  (option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  )
                                )
                              }
                            </TextField>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl variant='outlined'>
                            <FormLabel component='label' htmlFor='search-maxFlags-field'>
                              <Typography variant='subtitle1' color='textPrimary'>
                                {t('search:maxFlags.label')}
                              </Typography>
                            </FormLabel>
                            <TextField
                              id='search-maxFlags-field'
                              select
                              // label="Native select"
                              value={maxFlags}
                              onChange={(event) => setMaxFlags(+event.target.value)}
                              SelectProps={{
                                native: true
                              }}
                              // helperText="Please select your currency"
                              variant='outlined'
                            >
                              {
                                map(
                                  range(redflagsCount + 1 - minFlags),
                                  (option) => (
                                    <option key={option + minFlags} value={option + minFlags}>
                                      {option + minFlags}
                                    </option>
                                  )
                                )
                              }
                            </TextField>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </form>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <Box mt={4}>
                  {!!currentSearchString && (
                    <>
                      {pages > 1 && (
                        <Pagination
                          variant='outlined'
                          shape='rounded'
                          page={page}
                          count={pages}
                          onChange={handleChangePage}
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
                          onChange={handleChangePage}
                        />
                      )}
                    </>
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
