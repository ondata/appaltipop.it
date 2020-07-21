import { useState } from 'react'

import Head from 'next/head'
import dynamic from 'next/dynamic'

import { map, filter, orderBy, includes } from 'lodash'

import useTranslation from 'next-translate/useTranslation'

import {
  Container,
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  TextField
} from '@material-ui/core'

import { getI18nPaths, getI18nProps, withI18n } from '../../utils/i18n'

import { CONTAINER_BREAKPOINT, DOWNLOAD_URL, DATE_FORMAT, FLOAT_FORMAT } from '../../config/constants'

import { timeFormat, numberFormat } from '../../utils/formats'

import { getBuyers } from '../../utils/queries'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Breadcrumbs from '../../components/Breadcrumbs'
import { Button as CtaButton } from '../../components/Cta'

function Index ({ buyers }) {
  const { t, lang } = useTranslation()
  const tf = timeFormat(lang).format
  const nf = numberFormat(lang).format
  const MDXContent = dynamic(() => import(`../../locales/${lang}/download.mdx`))

  const [searchString, setSearchString] = useState('')

  return (
    <>

      <Head>
        <title>{`${t('common:download')} | ${t('common:title')}`}</title>
      </Head>

      <Header />

      <main>

        <Container component='header' maxWidth={CONTAINER_BREAKPOINT}>

          <Box mb={4}>
            <Breadcrumbs
              items={[
                { label: t('common:home'), url: '/' },
                { label: t('common:tenders'), url: '/tenders' },
                { label: t('common:download') }
              ]}
            />
          </Box>

          <Box mb={8}>
            <Grid container>
              <Grid item xs={12} md={8}>
                <MDXContent />
              </Grid>
            </Grid>
          </Box>

        </Container>

        <Box component='section' className='band band-g'>
          <Container maxWidth={CONTAINER_BREAKPOINT}>

            <Typography variant='h2'>
              {t`download:title`}
            </Typography>

            <TextField
              value={searchString}
              onChange={event => setSearchString(event.target.value)}
              label={t('download:searchLabel')}
              type='search'
              variant='outlined'
            />

            <List>
              {
                map(
                  filter(
                    orderBy(
                      buyers,
                      'ocds:releases/0/buyer/name'
                    ),
                    buyer => includes(buyer['ocds:releases/0/buyer/name'].toLowerCase(), searchString.toLowerCase())
                  ),
                  (buyer, index) => (
                    <ListItem divider disableGutters key={buyer['ocds:releases/0/buyer/id']}>
                      <Grid container spacing={2} alignItems='center'>
                        <Grid item xs={6} md>
                          <Typography variant='caption'>{t('common:buyer')}</Typography>
                          <Typography variant='body1' color='inherit'>{buyer['ocds:releases/0/buyer/name']}</Typography>
                        </Grid>
                        <Grid item xs={6} md='auto'>
                          <Typography variant='caption'>{t('buyer:appaltipop/releases/0/buyer/dataSource/lastUpdate')}</Typography>
                          <Typography variant='body1' color='inherit'>{tf(DATE_FORMAT)(new Date(buyer['appaltipop:releases/0/buyer/dataSource/lastUpdate']))}</Typography>
                        </Grid>
                        {
                          map(
                            buyer['appaltipop:releases/0/buyer/dataSource/resources'],
                            resource => (
                              <Grid item xs={6} md='auto' key={resource['appaltipop:releases/0/buyer/resource/format']}>
                                <CtaButton
                                  title={t(`download:formats.${resource['appaltipop:releases/0/buyer/resource/format']}`)}
                                  description={`${nf(FLOAT_FORMAT)(resource['appaltipop:releases/0/buyer/resource/sizeBytes'] / 10 ** 6)} MB`}
                                  url={`${DOWNLOAD_URL}/${resource['appaltipop:releases/0/buyer/resource/url']}`}
                                  icon='/icons/download.svg'
                                  noMargins
                                />
                              </Grid>
                            )
                          )
                        }
                      </Grid>
                    </ListItem>
                  )
                )
              }
            </List>

          </Container>
        </Box>

      </main>

      <Footer />

    </>
  )
}

export const getStaticProps = async (ctx) => ({
  props: {
    ...(await getI18nProps(ctx, ['common', 'download', 'buyer'])),
    buyers: map((await getBuyers()).hits, '_source')
  }
})

export const getStaticPaths = async () => ({
  paths: getI18nPaths(),
  fallback: false
})

export default withI18n(Index)
