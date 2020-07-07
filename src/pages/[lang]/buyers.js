import Head from 'next/head'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import { Container, Box, Grid, Typography } from '@material-ui/core'

import { getI18nPaths, getI18nProps, withI18n } from '../../utils/i18n'

import {
  CONTAINER_BREAKPOINT,
  API_VERSION
} from '../../config/constants'

import {
  getBuyersCount,
  getTendersCount,
  getRedTendersCount
} from '../../utils/queries'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SearchResults from '../../components/SearchResults'
import { Buyer } from '../../components/SearchResult'
import {
  BuyersCounter,
  TendersCounter,
  FlagsCounter
} from '../../components/Counter'

function Index ({ buyersCount = 0, tendersCount = 0, redTendersCount = 0 }) {
  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{`${t('common:buyers')} | ${t('common:title')}`}</title>
      </Head>

      <Header />

      <main>
        <Container component='header' maxWidth={CONTAINER_BREAKPOINT}>
          <Box mb={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography component='h1' variant='subtitle1'>
                  {t('common:buyers')}
                </Typography>
                <Typography component='span' variant='h1'>
                  {t('buyer:search.title')}
                </Typography>
              </Grid>
              <Grid item xs={4} sm={2}>
                <BuyersCounter
                  count={buyersCount}
                  label={t('buyer:counter.buyer', {
                    count: buyersCount
                  })}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TendersCounter
                  count={tendersCount}
                  label={t('buyer:counter.tender', {
                    count: tendersCount
                  })}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <FlagsCounter
                  count={`${Math.round(
                    (redTendersCount / tendersCount) * 100
                  )}%`}
                  label={t('buyer:counter.redflag', {
                    count: redTendersCount
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography component='div' variant='body2'>
                  <ReactMarkdown
                    source={t('buyer:search.description')}
                  />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>

        <Box component='section' className='band band-g'>
          <Container maxWidth={CONTAINER_BREAKPOINT}>
            <SearchResults
              endpoint={`/api/${API_VERSION}/buyers`}
              itemId='ocds:releases/0/buyer/id'
              itemType='buyer'
            >
              <Buyer />
            </SearchResults>
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
      ...(await getI18nProps(ctx, ['common', 'buyer'])),
      buyersCount: await getBuyersCount(),
      tendersCount: await getTendersCount(),
      redTendersCount: await getRedTendersCount()
    },
    unstable_revalidate: 3600
  }
}

export const getStaticPaths = async () => ({
  paths: getI18nPaths(),
  fallback: false
})

export default withI18n(Index)
