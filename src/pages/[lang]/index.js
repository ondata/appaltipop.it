import Head from 'next/head'
import dynamic from 'next/dynamic'

import { map, sortBy, isEmpty } from 'lodash'

import useTranslation from 'next-translate/useTranslation'

import {
  Container,
  Typography,
  Paper,
  Grid,
  Box
} from '@material-ui/core'

import { getI18nPaths, getI18nProps, withI18n } from '../../utils/i18n'

import { CONTAINER_BREAKPOINT } from '../../config/constants'

import {
  getTendersCount,
  getBuyersCount,
  getSuppliersCount,
  getRedflags
} from '../../utils/queries'

import Footer from '../../components/Footer'
import Header from '../../components/Header'

import { Card as CtaCard } from '../../components/Cta'

function Index ({
  tendersCount,
  buyersCount,
  suppliersCount,
  redflags
}) {
  const { t, lang } = useTranslation()
  const MDXContentIntroduction = dynamic(() => import(`../../locales/${lang}/home/introduction.mdx`))
  const MDXContentOcds = dynamic(() => import(`../../locales/${lang}/home/ocds.mdx`))
  const MDXContentRedflag = dynamic(() => import(`../../locales/${lang}/home/redflag.mdx`))

  return (
    <>

      <Head>
        <title>{t`common:title`}</title>
      </Head>

      <Header />

      <main>
        <Container component='header' maxWidth={CONTAINER_BREAKPOINT}>
          <Box component='h1' m={0}>
            <img
              src='/logo.svg'
              alt='AppaltiPOP'
              title='AppaltiPOP'
              style={{ maxWidth: '100%' }}
            />
          </Box>
          <Typography component='span' variant='subtitle1'>
            {t`common:claim`}
          </Typography>
        </Container>

        <Container component='section' maxWidth={CONTAINER_BREAKPOINT}>
          <Box mb={8} mt={8}>
            <Paper elevation={0}>
              <MDXContentIntroduction />
            </Paper>
          </Box>
        </Container>

        <Box component='section' className='band band-b band-home'>
          <Container maxWidth={CONTAINER_BREAKPOINT}>
            <Grid container spacing={4} alignItems='center'>
              <Grid item xs={12} sm={6}>
                <MDXContentOcds />
              </Grid>
              <Grid item xs={12} sm={6}>
                <img
                  src='/images/ocds.svg'
                  alt='OCDS'
                  title='OCDS'
                  style={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box component='section' className='band band-w band-home'>
          <Container maxWidth={CONTAINER_BREAKPOINT}>
            <Grid container spacing={4} justify='center'>
              {
                map(
                  t('home:ctas', {}, { returnObjects: true }),
                  (cta, index) => (
                    <Grid item key={t(`cta:${cta}.url`)} xs={10} sm={(Math.floor(index / 2)) % 2 ? (index % 2 ? 6 : 4) : (index % 2 ? 4 : 6)}>
                      <CtaCard noMargins {...t(`cta:${cta}`, {}, { returnObjects: true })} />
                    </Grid>
                  )
                )
              }
            </Grid>
          </Container>
        </Box>

        <Box component='section' className='band band-w band-home'>
          <Container maxWidth={CONTAINER_BREAKPOINT}>
            <Box mb={8}>
              <MDXContentRedflag
                redflags={map(
                  sortBy(
                    redflags,
                    'appaltipop:releases/0/redflag/code'
                  ),
                  redflag => {
                    const id = redflag['appaltipop:releases/0/redflag/code']
                    const title = t(
                      `redflags:${id}.title`,
                      {},
                      { returnObjects: true }
                    )
                    const description = t(
                      `redflags:${id}.description`,
                      {},
                      { returnObjects: true }
                    )

                    return {
                      id,
                      title: isEmpty(title) ? `${t('common:redflag')} ${id}` : title,
                      description: isEmpty(description) ? redflag['appaltipop:releases/0/redflag/description'] : description
                    }
                  }
                )}
              />
            </Box>
          </Container>
        </Box>

      </main>

      <Footer />

    </>
  )
}

export const getStaticProps = async (ctx) => {
  const { lang, namespaces } = await getI18nProps(ctx, [
    'common',
    'home',
    'cta',
    'redflags'
  ])
  return {
    props: {
      lang,
      namespaces,
      tendersCount: await getTendersCount(),
      buyersCount: await getBuyersCount(),
      suppliersCount: await getSuppliersCount(),
      redflags: map((await getRedflags()).hits, '_source')
    }
  }
}

export const getStaticPaths = async () => ({
  paths: getI18nPaths(),
  fallback: false
})

export default withI18n(Index)
