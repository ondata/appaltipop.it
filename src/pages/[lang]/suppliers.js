import { useState, useEffect } from 'react'

import Head from 'next/head'
import Link from 'next/link'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import axios from 'axios'

import { map } from 'lodash'

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
  Divider
} from '@material-ui/core'

import { HighlightOff, ArrowForward } from '@material-ui/icons'

import { Pagination } from '@material-ui/lab'

import { getI18nPaths, getI18nProps, withI18n } from '../../utils/i18n'

import {
  CONTAINER_BREAKPOINT,
  PAGE_SIZE,
  API_VERSION
} from '../../config/constants'

import {
  getSuppliersCount,
  getTendersCount,
  getRedflagsCount
} from '../../utils/queries'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AvatarIcon from '../../components/AvatarIcon'
import { Supplier } from '../../components/SearchResult'
import { SuppliersCounter, FlagsCounter } from '../../components/Counter'

function Index ({ suppliersCount = 0, tendersCount = 0, redflagsCount = 0 }) {
  const { t, lang } = useTranslation()

  const [suppliers, setSuppliers] = useState([])
  const [results, setResults] = useState(0)
  const [resultsLabel, setResultsLabel] = useState(<>&nbsp;</>)
  const [searchString, setSearchString] = useState('')
  const [currentSearchString, setCurrentSearchString] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [waiting, setWaiting] = useState(false)

  function handleSubmit (e) {
    setCurrentSearchString(searchString)
    e.preventDefault()
  }

  function handleReset () {
    setSearchString('')
    setSuppliers([])
    setResults(0)
    setPage(1)
    setCurrentSearchString('')
  }

  function handleChangePage (e, value) {
    setPage(value)
  }

  function handleRequest () {
    if (currentSearchString) {
      setWaiting(true)
      axios
        .get(`/api/${API_VERSION}/suppliers`, {
          params: {
            q: currentSearchString,
            lang,
            page: page - 1
          }
        })
        .then((res) => {
          setResults(res.data.total.value)
          setSuppliers(map(res.data.hits, '_source'))
          setWaiting(false)
        })
    } else {
      setSuppliers([])
    }
  }

  useEffect(() => {
    setResults(0)
    setPage(0)
  }, [currentSearchString])

  useEffect(() => {
    if (page) {
      handleRequest()
    } else {
      setPage(1)
    }
  }, [page])

  useEffect(() => {
    if (results) {
      setResultsLabel(
        t('search:results', {
          query: currentSearchString,
          count: results
        })
      )

      setPages(
        Math.floor(results / PAGE_SIZE) + (results % PAGE_SIZE ? 1 : 0)
      )
    } else {
      setResultsLabel(<>&nbsp;</>)
    }
  }, [results])

  return (
    <>
      <Head>
        <title>{`${t('common:suppliers')} | ${t(
                    'common:title'
                )}`}
        </title>
      </Head>

      <Header />

      <main>
        <Container component='header' maxWidth={CONTAINER_BREAKPOINT}>
          <Box mb={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography component='h1' variant='subtitle1'>
                  {t('common:suppliers')}
                </Typography>
                <Typography component='span' variant='h1'>
                  {t('supplier:search.title')}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <SuppliersCounter
                  count={suppliersCount}
                  label={t('supplier:counter.supplier', {
                    count: suppliersCount
                  })}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <FlagsCounter
                  count={`${Math.round(
                                        (redflagsCount / tendersCount) * 100
                                    )}%`}
                  label={t('supplier:counter.redflag', {
                    count: redflagsCount
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography component='div' variant='body2'>
                  <ReactMarkdown
                    source={t(
                      'supplier:search.description'
                    )}
                  />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>

        <Box pb={8} component='section' className='band band-g'>
          <Container maxWidth={CONTAINER_BREAKPOINT}>
            <Grid container>
              <Grid item xs={12} sm={8}>
                <Typography
                  component='label'
                  htmlFor='search-field'
                  variant='subtitle1'
                >
                  {t('supplier:search.label')}
                </Typography>
                <form
                  noValidate
                  autoComplete='off'
                  onSubmit={handleSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item xs>
                      <FormControl
                        variant='outlined'
                        fullWidth
                      >
                        <OutlinedInput
                          id='search-field'
                          placeholder={t('supplier:search.help')}
                          value={searchString}
                          onChange={(e) => setSearchString(e.target.value)}
                          endAdornment={
                            (!!searchString && (
                              <InputAdornment position='end'>
                                <IconButton
                                  aria-label={t('common:search.reset')}
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
                            ))
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <Button
                        variant='contained'
                        color='primary'
                        disableElevation
                        type='submit'
                        style={{ height: '100%' }}
                      >
                        {t('common:search.cta')}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
                <Typography component='p' variant='caption'>
                  {currentSearchString ? (
                    resultsLabel
                  ) : (
                    <>&nbsp;</>
                  )}
                </Typography>
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
                          suppliers,
                          (supplier, index) => (
                            <Box
                              component='li'
                              key={supplier['ocds:releases/0/parties/0/id']}
                            >
                              {!!index && (
                                <Divider />
                              )}
                              <Link
                                href='/[lang]/supplier/[id]'
                                as={`/${lang}/supplier/${supplier['ocds:releases/0/parties/0/id']}`}
                              >
                                <ListItem
                                  button
                                >
                                  <ListItemIcon>
                                    <AvatarIcon color='primary'>
                                      <ArrowForward />
                                    </AvatarIcon>
                                  </ListItemIcon>
                                  <Supplier
                                    {...supplier}
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
      ...(await getI18nProps(ctx, ['common', 'supplier', 'search'])),
      suppliersCount: await getSuppliersCount(),
      tendersCount: await getTendersCount(),
      redflagsCount: await getRedflagsCount()
    },
    unstable_revalidate: 3600
  }
}

export const getStaticPaths = async () => ({
  paths: getI18nPaths(),
  fallback: false
})

export default withI18n(Index)
