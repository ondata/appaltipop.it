import Head from 'next/head'

import { map, sortBy } from 'lodash'

import useTranslation from 'next-translate/useTranslation'

import ReactMarkdown from 'react-markdown'

import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'

import { getStaticPage } from '../../utils/pages'

import { getI18nPaths, getI18nProps, withI18n } from '../../utils/i18n'

import { CONTAINER_BREAKPOINT } from '../../config/constants'

import { getRedflags } from '../../utils/queries'

import Footer from '../../components/Footer'
import Header from '../../components/Header'

function Index ({ redflags, contents }) {
  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{`${t('common:ocds')} | ${t('common:title')}`}</title>
      </Head>

      <Header />

      <main>
        <Container component='header' maxWidth={CONTAINER_BREAKPOINT}>
          <Box mb={8} mt={8}>
            <Typography variant='h1'>{t('ocds:title')}</Typography>
            <Typography component='div' variant='body2'>
              <ReactMarkdown
                source={contents.introduction.content}
              />
            </Typography>

            <Typography variant='h2'>
              {t('ocds:presentation.title')}
            </Typography>
            <Typography component='div' variant='body2'>
              <ReactMarkdown
                source={contents.presentation.content}
              />
            </Typography>

            <Typography variant='h2'>
              {t('ocds:compliance.title')}
            </Typography>
            <Typography component='div' variant='body2'>
              <ReactMarkdown
                source={contents.compliance.content}
              />
            </Typography>

            <Typography variant='h2'>
              {t('ocds:redflags.title')}
            </Typography>
            <Typography component='div' variant='body2'>
              <ReactMarkdown
                source={
                  contents.redflags.introduction.content
                }
              />
            </Typography>
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
            <Typography component='div' variant='body2'>
              <ReactMarkdown
                source={
                  contents.redflags.conclusions.content
                }
              />
            </Typography>
          </Box>
        </Container>
      </main>

      <Footer />
    </>
  )
}

export const getStaticProps = async (ctx) => {
  const { lang, namespaces } = await getI18nProps(ctx, ['common', 'ocds'])
  return {
    props: {
      lang,
      namespaces,
      redflags: map((await getRedflags()).hits, '_source'),
      contents: {
        introduction: await getStaticPage(namespaces.ocds.introduction),
        presentation: await getStaticPage(namespaces.ocds.presentation),
        compliance: await getStaticPage(namespaces.ocds.compliance),
        redflags: {
          introduction: await getStaticPage(
            namespaces.ocds.redflags.introduction
          ),
          conclusions: await getStaticPage(
            namespaces.ocds.redflags.conclusions
          )
        }
      }
    }
  }
}

export const getStaticPaths = async () => ({
  paths: getI18nPaths(),
  fallback: false
})

export default withI18n(Index)
