import NextLink from 'next/link'
import useTranslation from 'next-translate/useTranslation'

import { includes, startsWith } from 'lodash'

export default function Link (props) {
  const { lang: currentLang } = useTranslation()
  const {
    href = '',
    as = href,
    lang = currentLang,
    children,
    ...other
  } = props

  if (includes(href, '://') || startsWith(href, '//') || startsWith(href, 'mailto:')) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
      >
        {children}
      </a>
    )
  } else {
    return (
      <NextLink
        href={`/[lang]${href.replace(/^\/\[lang\]/, '').replace(/\/$/, '')}`}
        as={`/${lang}${as.replace(/^\/\[lang\]/, '').replace(/\/$/, '')}`}
        {...other}
      >
        {children}
      </NextLink>
    )
  }
}
