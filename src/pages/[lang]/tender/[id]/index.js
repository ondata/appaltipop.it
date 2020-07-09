import Head from 'next/head'
import { useRouter } from 'next/router'

import useTranslation from 'next-translate/useTranslation'

import { map } from 'lodash'

import {
  Container,
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Divider
} from '@material-ui/core'

import {
  Print,
  ArrowForward
} from '@material-ui/icons'

import { getI18nProps, withI18n } from '../../../../utils/i18n'

import { numberFormat, timeFormat } from '../../../../utils/formats'

import {
  CONTAINER_BREAKPOINT,
  CURRENCY_FORMAT,
  DATE_FORMAT,
  INTEGER_FORMAT
} from '../../../../config/constants'

import { getTenderById } from '../../../../utils/queries'
import { getTenderPaths } from '../../../../utils/paths'

import Link from '../../../../components/Link'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'

import { FlagsCounter } from '../../../../components/Counter'
import { Supplier, Buyer } from '../../../../components/SearchResult'
import FlagsInfo from '../../../../components/FlagsInfo'
import KeyValue from '../../../../components/KeyValue'
import AvatarIcon from '../../../../components/AvatarIcon'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import { Button as CtaButton } from '../../../../components/Cta'

function Index ({ tender = {}, buyers = [], suppliers = [], redflags = [] }) {
  const router = useRouter()
  const { t, lang } = useTranslation()

  const nf = numberFormat(lang).format
  const tf = timeFormat(lang).format

  if (router.isFallback) {
    return <div>Loading...</div>
  } else {
    return (
      <>
        <Head>
          <title>{`${t('common:tender')} n. ${
            tender['ocds:releases/0/id']
            } | ${t('common:title')}`}
          </title>
        </Head>

        <Header />

        <main>

          <Container component='section' maxWidth={CONTAINER_BREAKPOINT}>

            <Box mb={4}>
              <Breadcrumbs
                items={[
                  { label: t('common:home'), url: '/' },
                  { label: t('common:tenders'), url: '/tenders' },
                  { label: t('common:tender') }
                ]}
              />
            </Box>

            <Box mb={8}>
              <Grid container spacing={2} justify='space-between'>

                <Grid item xs={12} sm={8}>

                  <Typography variant='h1'>
                    {tender['ocds:releases/0/tender/title']}
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

                <Grid item xs={12} sm='auto'>
                  <FlagsCounter
                    count={redflags.length}
                    label={t('common:redflag', {
                      count: redflags.length
                    })}
                  />
                </Grid>

              </Grid>
            </Box>

          </Container>

          <Container component='section' maxWidth={CONTAINER_BREAKPOINT}>
            <Box mb={8}>

              <Grid container spacing={2}>

                <Grid item xs={12}>

                  <Typography variant='subtitle2' color='inherit'>
                    {t('common:buyer', { count: buyers.length })}
                  </Typography>

                  <List>
                    {map(buyers, (buyer, index) => (
                      <Box
                        component='li'
                        key={buyer['ocds:releases/0/buyer/id']}
                      >
                        {!!index && <Divider />}
                        <Link
                          href='/buyer/[id]'
                          as={`/buyer/${buyer['ocds:releases/0/buyer/id']}`}
                          passHref
                        >
                          <ListItem component='a' button>
                            <ListItemIcon>
                              <AvatarIcon color='primary'>
                                <ArrowForward />
                              </AvatarIcon>
                            </ListItemIcon>
                            <Buyer {...buyer} />
                          </ListItem>
                        </Link>
                      </Box>
                    ))}
                  </List>

                </Grid>

                <Grid item xs={6} sm={3}>
                  <KeyValue
                    title={t('tender:ocds/releases/0/id')}
                    label={tender['ocds:releases/0/id']}
                  />
                </Grid>

                <Grid item xs={6} sm={3}>
                  <KeyValue
                    title={t('tender:ocds/releases/0/tender/contractPeriod/startDate')}
                    label={tender['ocds:releases/0/tender/contractPeriod/startDate']
                      ? tf(DATE_FORMAT)(
                        new Date(
                          tender[
                            'ocds:releases/0/tender/contractPeriod/startDate'
                          ]
                        )
                      )
                      : '-'}
                  />
                </Grid>

                <Grid item xs={6} sm={3}>
                  <KeyValue
                    title={t('tender:ocds/releases/0/tender/contractPeriod/endDate')}
                    label={tender['ocds:releases/0/tender/contractPeriod/endDate']
                      ? tf(DATE_FORMAT)(
                        new Date(
                          tender[
                            'ocds:releases/0/tender/contractPeriod/endDate'
                          ]
                        )
                      )
                      : '-'}
                  />
                </Grid>

                <Grid item xs={6} sm={3}>
                  <KeyValue
                    title={t('tender:appaltipop/releases/0/tender/participants/total')}
                    label={nf(INTEGER_FORMAT)(suppliers.length)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <KeyValue
                    title={t('tender:ocds/releases/0/tender/procurementMethodDetails')}
                    label={tender['ocds:releases/0/tender/procurementMethodDetails'] || '-'}
                  />
                </Grid>

                <Grid item xs={6}>
                  <KeyValue
                    title={t('tender:ocds/releases/0/awards/0/value/amount')}
                    label={tender['ocds:releases/0/awards/0/value/amount']
                      ? nf(CURRENCY_FORMAT)(
                        tender['ocds:releases/0/awards/0/value/amount']
                      )
                      : '-'}
                  />
                </Grid>

                <Grid item xs={6}>
                  <KeyValue
                    title={t('tender:ocds/releases/0/contracts/0/implementation/transactions/0/value/amount')}
                    label={tender['ocds:releases/0/contracts/0/implementation/transactions/0/value/amount']
                      ? nf(CURRENCY_FORMAT)(
                        tender['ocds:releases/0/contracts/0/implementation/transactions/0/value/amount']
                      )
                      : '-'}
                  />
                </Grid>

                <Grid item xs={12}>

                  <Typography variant='subtitle2' color='inherit'>
                    {t('common:supplier', { count: suppliers.length })}
                  </Typography>

                  <List>
                    {map(suppliers, (supplier, index) => (
                      <Box
                        component='li'
                        key={supplier['ocds:releases/0/parties/0/id']}
                      >
                        {!!index && <Divider />}
                        <Link
                          href='/supplier/[id]'
                          as={`/supplier/${supplier['ocds:releases/0/parties/0/id']}`}
                          passHref
                        >
                          <ListItem component='a' button>
                            <ListItemIcon>
                              <AvatarIcon color='primary'>
                                <ArrowForward />
                              </AvatarIcon>
                            </ListItemIcon>
                            <Supplier {...supplier} />
                          </ListItem>
                        </Link>
                      </Box>
                    ))}
                  </List>

                </Grid>

              </Grid>

            </Box>
          </Container>

          <Container component='section' maxWidth={CONTAINER_BREAKPOINT}>
            {
              !!redflags.length && (
                <Box mt={8} mb={8}>
                  <Typography variant='h2'>
                    {t('common:redflag', { count: redflags.length })}
                  </Typography>
                  <FlagsInfo
                    flags={map(
                      redflags,
                      'appaltipop:releases/0/redflag/code'
                    )}
                  />
                </Box>
              )
            }
          </Container>

          <Container component='section' maxWidth={CONTAINER_BREAKPOINT}>
            <Box mb={8}>
              <Grid container spacing={2} justify='center'>
                <Grid item xs={6} sm={4}>
                  <CtaButton
                    title={t('cta:foia.title')}
                    icon='/icons/foia.png'
                    url={t('cta:foia.url')}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <CtaButton
                    title={t('cta:whistle.title')}
                    icon='/icons/whistle.svg'
                    url={t('cta:whistle.url')}
                  />
                </Grid>
              </Grid>
            </Box>

          </Container>

          {/* <Container component="section" maxWidth={CONTAINER_BREAKPOINT}>

                    <Box mb={8}>
                        <Grid container spacing={2}>

                            <Grid item xs={12} sm={4}>
                                <DonutChart title={t("tender:donut.1.title")} description={t("tender:donut.1.description")} />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <DonutChart title={t("tender:donut.2.title")} description={t("tender:donut.2.description")} />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <DonutChart title={t("tender:donut.3.title")} description={t("tender:donut.3.description")} />
                            </Grid>

                        </Grid>
                    </Box>

                    <Box mb={8}>
                        <BarChart title={t("tender:bar.1.title")} description={t("tender:bar.1.description")} />
                    </Box>

                    <Box mb={8}>
                        <Partner
                            images={["/partners/transparency-international-italy.png"]}
                            title={t("tender:monitoredBy.title")}
                            description={t("tender:monitoredBy.description")}
                        />
                    </Box>

                </Container> */}

        </main>

        <Footer />
      </>
    )
  }
}

export const getStaticProps = async (ctx) => {
  const tender = await getTenderById(ctx.params.id)
  return {
    props: {
      ...(await getI18nProps(ctx, [
        'common',
        'tender',
        'supplier',
        'redflags',
        'cta'
      ])),
      tender,
      buyers: tender['appaltipop:releases/0/buyers'] || [],
      suppliers: tender['appaltipop:releases/0/suppliers'] || [],
      redflags: tender['appaltipop:releases/0/redflags'] || []
    }
  }
}

export const getStaticPaths = async () => ({
  paths: await getTenderPaths(),
  fallback: true
})

export default withI18n(Index)
