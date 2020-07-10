import { useEffect } from 'react'
import { MDXProvider } from '@mdx-js/react'

import PropTypes from 'prop-types'
import Head from 'next/head'

import { DefaultSeo } from 'next-seo'

import { ThemeProvider } from '@material-ui/core/styles'

import {
  CssBaseline,
  Grid,
  Typography
} from '@material-ui/core'

import {
  Button as CtaButton,
  Card as CtaCard
} from '../components/Cta'

import Redflags from '../components/Redflags'

import SEO from '../config/next-seo'
import theme from '../config/theme'

import '../styles/app.scss'

export default function App ({ Component, pageProps }) {
  const mdComponents = {
    h1: props => <Typography variant='h1' {...props} />,
    h2: props => <Typography variant='h2' {...props} />,
    p: props => <Typography variant='body2' gutterBottom {...props} />,
    ul: props => <ul className='MuiTypography-root MuiTypography-body2 MuiTypography-gutterBottom' {...props} />,
    ol: props => <ol className='MuiTypography-root MuiTypography-body2 MuiTypography-gutterBottom' {...props} />,
    Button: props => <CtaButton {...props} />,
    Card: props => <CtaCard {...props} />,
    Redflags: props => <Redflags {...props} />,
    Grid: props => <Grid {...props} />
  }

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <title>AppaltiPOP</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <DefaultSeo {...SEO} />
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <MDXProvider components={mdComponents}>
          <Component {...pageProps} />
        </MDXProvider>
      </ThemeProvider>
    </>
  )
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
}
