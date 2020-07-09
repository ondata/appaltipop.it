import Head from 'next/head'
import { useRouter } from 'next/router'

import { map } from 'lodash'

import useTranslation from 'next-translate/useTranslation'

import {
  Container,
  Box,
  Grid,
  Typography
} from '@material-ui/core'

import { Print } from '@material-ui/icons'

import { getI18nProps, withI18n } from '../../../../utils/i18n'

import { numberFormat } from '../../../../utils/formats'

import {
  CONTAINER_BREAKPOINT,
  CURRENCY_FORMAT
} from '../../../../config/constants'

import {
  getBuyerById,
  getTendersCountByBuyer,
  getRedTendersCountByBuyer,
  getTendersValueAmountByBuyer,
  getTendersTransactionAmountByBuyer
} from '../../../../utils/queries'

import { getBuyerPaths } from '../../../../utils/paths'

import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'

import { FlagsCounter, TendersCounter } from '../../../../components/Counter'
import KeyValue from '../../../../components/KeyValue'
import AvatarIcon from '../../../../components/AvatarIcon'
import Breadcrumbs from '../../../../components/Breadcrumbs'

import { Card as CtaCard } from '../../../../components/Cta'

function Index ({
  buyer = {},
  tendersCount = 0,
  redflagsCount = 0,
  valueAmount = 0,
  transactionAmount = 0
}) {
  const router = useRouter()
  const { t, lang } = useTranslation()

  const nf = numberFormat(lang).format

  if (router.isFallback) {
    return <div>Loading...</div>
  } else {
    return (
      <>
        <Head>
          <title>{`${t('common:buyer')} n. ${
            buyer['ocds:releases/0/buyer/id']
            } | ${t('common:title')}`}
          </title>
        </Head>

        <Header />

        <main>

          <Container component='header' maxWidth={CONTAINER_BREAKPOINT}>

            <Box mb={4}>
              <Breadcrumbs
                items={[
                  { label: t('common:home'), url: '/' },
                  { label: t('common:tenders'), url: '/tenders' },
                  { label: t('common:tender') },
                  { label: t('common:buyer') }
                ]}
              />
            </Box>

            <Box mb={8}>
              <Grid container spacing={2} justify='space-between'>

                <Grid item xs={12} sm={6} md>

                  <Typography variant='h1'>
                    {buyer['ocds:releases/0/buyer/name']}
                  </Typography>

                  <Typography
                    component='div'
                    variant='subtitle1'
                    style={{ fontSize: '1rem' }}
                  >
                    <Grid container spacing={2} alignItems='center'>
                      <Grid item>
                        <a target='_blank' href='#'>
                          {t('common:print')}
                        </a>
                      </Grid>
                      <Grid item>
                        <AvatarIcon color='primary'>
                          <Print />
                        </AvatarIcon>
                      </Grid>
                    </Grid>
                  </Typography>

                </Grid>

                <Grid item xs={6} sm={3} md='auto'>
                  <TendersCounter
                    count={tendersCount}
                    label={t('common:tender', {
                      count: tendersCount
                    })}
                  />
                </Grid>

                <Grid item xs={6} sm={3} md='auto'>
                  <FlagsCounter
                    count={`${Math.round(
                      (redflagsCount / tendersCount) * 100
                    )}%`}
                    label={t('common:redflag', {
                      count: redflagsCount
                    })}
                  />
                </Grid>

              </Grid>
            </Box>

          </Container>

          <Container component='section' maxWidth={CONTAINER_BREAKPOINT}>
            <Box mb={8}>
              <Grid container spacing={2}>

                <Grid item xs={12} sm={4}>
                  <KeyValue
                    title={t(
                      'buyer:ocds/releases/0/buyer/id'
                    )}
                    label={
                      buyer['ocds:releases/0/buyer/id']
                    }
                  />
                </Grid>

                <Grid item xs={6} sm={4}>
                  <KeyValue
                    title={t('buyer:istat/DEN_CM')}
                    label={buyer['istat:DEN_CM']}
                  />
                </Grid>

                <Grid item xs={6} sm={4}>
                  <KeyValue
                    title={t('buyer:ocds/releases/0/parties/address/region')}
                    label={buyer['ocds:releases/0/parties/address/region']}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <KeyValue
                    title={t('buyer:ocds/releases/0/awards/0/value/amount')}
                    label={nf(CURRENCY_FORMAT)(valueAmount)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <KeyValue
                    title={t(
                      'buyer:ocds/releases/0/contracts/0/implementation/transactions/0/value/amount'
                    )}
                    label={nf(CURRENCY_FORMAT)(
                      transactionAmount
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Container>

          <Container component='section' maxWidth={CONTAINER_BREAKPOINT}>
            <Box mb={8}>
              <Grid container spacing={4}>
                {
                  map(
                    t('buyer:ctas', {}, { returnObjects: true }),
                    (cta) => (
                      <Grid item key={t(`cta:${cta}.url`)} xs={12} sm={6} md={4}>
                        <CtaCard {...t(`cta:${cta}`, {}, { returnObjects: true })} />
                      </Grid>
                    )
                  )
                }
              </Grid>
            </Box>
          </Container>

        </main>

        <Footer />
      </>
    )
  }
}

export const getStaticProps = async (ctx) => ({
  props: {
    ...(await getI18nProps(ctx, [
      'common',
      'buyer',
      'cta',
      'redflags'
    ])),
    buyer: await getBuyerById(ctx.params.id),
    tendersCount: await getTendersCountByBuyer(ctx.params.id),
    redflagsCount: await getRedTendersCountByBuyer(ctx.params.id),
    valueAmount: await getTendersValueAmountByBuyer(ctx.params.id),
    transactionAmount: await getTendersTransactionAmountByBuyer(
      ctx.params.id
    )
  }
})

export const getStaticPaths = async () => ({
  paths: await getBuyerPaths(),
  fallback: true
})

export default withI18n(Index)
