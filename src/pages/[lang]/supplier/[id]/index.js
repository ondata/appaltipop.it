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
  getSupplierById,
  getTendersCountBySupplier,
  getRedTendersCountBySupplier,
  getTendersValueAmountBySupplier,
  getTendersTransactionAmountBySupplier
} from '../../../../utils/queries'

import { getSupplierPaths } from '../../../../utils/paths'

import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'

import { FlagsCounter, TendersCounter } from '../../../../components/Counter'
import KeyValue from '../../../../components/KeyValue'
import AvatarIcon from '../../../../components/AvatarIcon'
import Breadcrumbs from '../../../../components/Breadcrumbs'

import { Card as CtaCard } from '../../../../components/Cta'

function Index ({
  supplier = {},
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
          <title>{`${t('common:supplier')} n. ${
            supplier['ocds:releases/0/parties/0/id']
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
                  { label: t('common:supplier') }
                ]}
              />
            </Box>

            <Box mb={8}>
              <Grid container spacing={2} justify='space-between'>

                <Grid item xs={12} sm>

                  <Typography variant='h1'>
                    {supplier['ocds:releases/0/parties/0/name']}
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

                <Grid item xs={12} md={4}>
                  <KeyValue
                    title={t(
                      'supplier:ocds/releases/0/parties/0/id'
                    )}
                    label={
                      supplier['ocds:releases/0/parties/0/id']
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <KeyValue
                    title={t('supplier:ocds/releases/0/awards/0/value/amount')}
                    label={nf(CURRENCY_FORMAT)(valueAmount)}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <KeyValue
                    title={t(
                      'supplier:ocds/releases/0/contracts/0/implementation/transactions/0/value/amount'
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
                    t('supplier:ctas', {}, { returnObjects: true }),
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

          {/* <Container component="section" maxWidth={CONTAINER_BREAKPOINT}>

              <Box mb={8}>
                  <Paper elevation={0}>
                      <Typography component="div" variant="body2">
                          <ReactMarkdown source={t("redflags:info")} />
                      </Typography>
                  </Paper>
              </Box>

              <Box mb={8}>

                  <Typography variant="h2" color="inherit">
                      {t("redflags:title")}
                  </Typography>

                  <Grid container spacing={2}>

                      <Grid item xs={12} sm={6}>

                          <List disablePadding>
                              {
                                  map(
                                      map(range(1, +t("redflags:flags") + 1), redflag => padStart(redflag, 2, 0)),
                                      flag => (
                                          <ListItem key={flag} style={{ backgroundColor: "#f9f9f9", border: "2px solid #E7E5FF", borderRadius: 8, marginBottom: 16 }}>
                                              <ListItemIcon><Flag color="secondary" /></ListItemIcon>
                                              <ListItemText primary={t(`redflags:${flag}.title`)} secondary={t(`redflags:${flag}.summary`)} />
                                          </ListItem>
                                      )
                                  )
                              }
                          </List>

                      </Grid>

                      <Grid item xs={12} sm={6}>
                          <Paper elevation={0}>
                              Lorem ipsum...
                          </Paper>
                      </Grid>

                  </Grid>

              </Box>

          </Container> */}

          {/* <Container component="section" maxWidth={CONTAINER_BREAKPOINT}>

              <Box mb={8}>

                  <Typography variant="h2" color="inherit">
                      {t("supplier:charts")}
                  </Typography>

                  <Grid container spacing={2}>

                      <Grid item xs={12} sm={6}>
                          <BarChart title={t("supplier:bar.1.title")} description={t("supplier:bar.1.description")} inverse />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                          <BarChart title={t("supplier:bar.2.title")} description={t("supplier:bar.2.description")} inverse />
                      </Grid>

                  </Grid>
              </Box>

              <Box mb={8}>
                  <BarChart title={t("supplier:bar.3.title")} description={t("supplier:bar.3.description")} inverse />
              </Box>

          </Container> */}

          {/* <Box mb={8} className='band band-g'>
            <Container
              component='section'
              maxWidth={CONTAINER_BREAKPOINT}
            >
              <Typography variant='h2' color='inherit'>
                {t('common:tenders')}
              </Typography>
              <SearchResults
                endpoint={`/api/${API_VERSION}/suppliers/${supplier['ocds:releases/0/parties/0/id']}/tenders`}
                itemId='ocds:releases/0/id'
                itemType='tender'
              >
                <Tender />
              </SearchResults>
            </Container>
          </Box> */}

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
      'supplier',
      'cta',
      'redflags'
    ])),
    supplier: await getSupplierById(ctx.params.id),
    tendersCount: await getTendersCountBySupplier(ctx.params.id),
    redflagsCount: await getRedTendersCountBySupplier(ctx.params.id),
    valueAmount: await getTendersValueAmountBySupplier(ctx.params.id),
    transactionAmount: await getTendersTransactionAmountBySupplier(
      ctx.params.id
    )
  }
})

export const getStaticPaths = async () => ({
  paths: await getSupplierPaths(),
  fallback: true
})

export default withI18n(Index)
