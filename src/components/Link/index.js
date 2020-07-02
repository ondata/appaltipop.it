import NextLink from 'next/link'
import useTranslation from 'next-translate/useTranslation'

export default function Link (props) {
  const { lang: currentLang } = useTranslation()
  const {
    href = '',
    as = href,
    lang = currentLang,
    children,
    ...other
  } = props

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
