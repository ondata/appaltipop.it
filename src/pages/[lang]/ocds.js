import Head from 'next/head'
import dynamic from 'next/dynamic'

import { map, sortBy } from 'lodash'

import useTranslation from 'next-translate/useTranslation'

import {
  Container,
  Box,
  Grid
} from '@material-ui/core'

import { getI18nPaths, getI18nProps, withI18n } from '../../utils/i18n'

import { CONTAINER_BREAKPOINT } from '../../config/constants'

import { getRedflags } from '../../utils/queries'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Breadcrumbs from '../../components/Breadcrumbs'

function Index ({ redflags }) {
  const { t, lang } = useTranslation()
  const MDXContent = dynamic(() => import(`../../locales/${lang}/ocds.mdx`))

  return (
    <>

      <Head>
        <title>{`${t('common:ocds')} | ${t('common:title')}`}</title>
      </Head>

      <Header />

      <main>

        <Container component='header' maxWidth={CONTAINER_BREAKPOINT}>

          <Box mb={4}>
            <Breadcrumbs
              items={[
                { label: t('common:home'), url: '/' },
                { label: t('common:ocds') }
              ]}
            />
          </Box>

          <Box mb={8}>
            <Grid container>
              <Grid item xs={12} md={8}>
                <MDXContent
                  redflags={map(
                    sortBy(
                      redflags,
                      'appaltipop:releases/0/redflag/code'
                    ),
                    redflag => ({
                      id: redflag['appaltipop:releases/0/redflag/code'],
                      title: t(`redflags:${redflag['appaltipop:releases/0/redflag/code']}.title`),
                      description: t(`redflags:${redflag['appaltipop:releases/0/redflag/code']}.description`)
                    })
                  )}
                />
              </Grid>
            </Grid>
          </Box>

        </Container>

      </main>

      <Footer />

    </>
  )
}

export const getStaticProps = async (ctx) => ({
  props: {
    ...(await getI18nProps(ctx, ['common', 'redflags'])),
    redflags: map((await getRedflags()).hits, '_source')
  }
})

export const getStaticPaths = async () => ({
  paths: getI18nPaths(),
  fallback: false
})

export default withI18n(Index)
