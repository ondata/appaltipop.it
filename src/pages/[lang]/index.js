import Head from 'next/head'

import { map, sortBy } from 'lodash'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'

import { getI18nPaths, getI18nProps, withI18n } from '../../utils/i18n'

import { CONTAINER_BREAKPOINT } from '../../config/constants'

import { getStaticPage } from '../../utils/pages'

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
  redflags,
  contents
}) {
  const { t } = useTranslation()

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
              <Typography component='div' variant='body2'>
                <ReactMarkdown
                  source={
                    contents.introduction.content
                  }
                />
              </Typography>
            </Paper>
          </Box>
        </Container>

        <Box component='section' className='band band-b band-home'>
          <Container maxWidth={CONTAINER_BREAKPOINT}>
            <Typography variant='h2'>
              {t`home:ocds.title`}
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography component='div' variant='body2'>
                  <ReactMarkdown
                    source={contents.ocds.content}
                  // linkTarget="_blank"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <img
                  src={t`home:ocds.image`}
                  alt='OCDS'
                  title='OCDS'
                  style={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box component='section' className='band band-w band-home'>
          <Grid container spacing={4} justify='center'>
            {
              map(
                t('home:ctas', {}, { returnObjects: true }),
                (cta, index) => (
                  <Grid item key={t(`cta:${cta}.url`)} xs={10} sm={(Math.floor(index / 2)) % 2 ? (index % 2 ? 6 : 4) : (index % 2 ? 4 : 6)}>
                    <CtaCard {...t(`cta:${cta}`, {}, { returnObjects: true })} />
                  </Grid>
                )
              )
            }
          </Grid>
        </Box>

        <Box component='section' className='band band-w band-home'>
          <Container maxWidth={CONTAINER_BREAKPOINT}>
            <Box mb={8}>
              <Typography variant='h2'>
                {t`home:redflag.title`}
              </Typography>
              <Typography component='div' variant='body2' gutterBottom>
                <ReactMarkdown
                  source={contents.redflag.content}
                // linkTarget="_blank"
                />
              </Typography>
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={8}>
                <List>
                  {map(
                    sortBy(
                      redflags,
                      'appaltipop:releases/0/redflag/code'
                    ),
                    (redflag, index) => (
                      <ListItem
                        key={redflag['appaltipop:releases/0/redflag/code']}
                      >
                        <ListItemIcon>
                          {index + 1}.
                        </ListItemIcon>
                        <ListItemText
                          primary={t(
                            `redflags:${redflag['appaltipop:releases/0/redflag/code']}.title`
                          )}
                          secondary={t(
                            `redflags:${redflag['appaltipop:releases/0/redflag/code']}.description`
                          )}
                        />
                      </ListItem>
                    )
                  )}
                </List>
              </Grid>
              <Grid item xs={12} sm={4}>
                <img
                  src={t`home:redflag.image`}
                  alt='Redflag'
                  title='Redflag'
                  style={{ width: '100%' }}
                />
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
      redflags: map((await getRedflags()).hits, '_source'),
      contents: {
        introduction: await getStaticPage(namespaces.home.introduction),
        ocds: await getStaticPage(namespaces.home.ocds),
        redflag: await getStaticPage(namespaces.home.redflag)
      }
    }
  }
}

export const getStaticPaths = async () => ({
  paths: getI18nPaths(),
  fallback: false
})

export default withI18n(Index)
