import { formatLocale } from 'd3-format'
import { timeFormatLocale } from 'd3-time-format'

import enNumberLocale from 'd3-format/locale/en-US.json'
import itNumberLocale from 'd3-format/locale/it-IT.json'

import enTimeLocale from 'd3-time-format/locale/en-US.json'
import itTimeLocale from 'd3-time-format/locale/it-IT.json'

import i18nConfig from '../config/i18n.json'

export const NUMBER_LOCALES = {
  it: itNumberLocale,
  en: enNumberLocale
}

export const TIME_LOCALES = {
  it: itTimeLocale,
  en: enTimeLocale
}

const { defaultLanguage } = i18nConfig

export function numberFormat (lang = defaultLanguage) {
  return formatLocale(NUMBER_LOCALES[lang] || NUMBER_LOCALES[defaultLanguage])
}

export function timeFormat (lang = defaultLanguage) {
  return timeFormatLocale(TIME_LOCALES[lang] || TIME_LOCALES[defaultLanguage])
}
