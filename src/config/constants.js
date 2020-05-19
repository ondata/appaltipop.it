export const ES_SCHEME = process.env.ES_SCHEME || "http"
export const ES_HOST = process.env.ES_HOST || "localhost"
export const ES_PORT = process.env.ES_PORT || 9200
export const ES_AUTH_USERNAME = process.env.ES_AUTH_USERNAME
export const ES_AUTH_PASSWORD = process.env.ES_AUTH_PASSWORD

export const ES_URL = `${ES_SCHEME}://${ES_HOST}:${ES_PORT}`

export const ES_INDEX_PREFIX = process.env.ES_INDEX_PREFIX || "es"
