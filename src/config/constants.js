export const ES_SCHEME = process.env.ES_SCHEME || 'http'
export const ES_HOST = process.env.ES_HOST || 'localhost'
export const ES_PORT = process.env.ES_PORT || 9200
export const ES_AUTH_USERNAME = process.env.ES_AUTH_USERNAME
export const ES_AUTH_PASSWORD = process.env.ES_AUTH_PASSWORD

export const ES_URL = `${ES_SCHEME}://${ES_HOST}:${ES_PORT}`

export const ES_INDEX_PREFIX = process.env.ES_INDEX_PREFIX || 'es'

export const FLOAT_FORMAT = ',.2f'
export const INTEGER_FORMAT = ',d'
export const PERCENTAGE_FORMAT = '.0%'
export const CURRENCY_FORMAT = '($,.2f'
export const LARGE_CURRENCY_FORMAT = '($,.0s'
export const LARGE_INTEGER_FORMAT = ',.3s'
export const DATE_FORMAT = '%x'

export const CONTAINER_BREAKPOINT = 'lg'

export const PAGE_SIZE = 25

export const API_VERSION = 'v1'

export const DOWNLOAD_URL = 'https://github.com/ondata/appaltipop/raw/master'
