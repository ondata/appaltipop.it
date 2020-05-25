import es from './es'

import {
    map,
    isEmpty,
    find,
} from 'lodash'

import {
    ES_INDEX_PREFIX,
    PAGE_SIZE,
} from '../config/constants'

import { defaultLanguage } from '../config/i18n.json'

async function getIds(index) {

    const { body } = await es.search({
        index,
        stored_fields: [],
        body: {
            query: {
                match_all: {},
            },
        },
    })

    return map(
        body.hits.hits,
        hit => ({
            index: hit["_index"],
            id: hit["_id"],
        }),
    )

}

export const getTenderIds = async () => await getIds(`${ES_INDEX_PREFIX}-tenders-*`)
export const getBuyerIds = async () => await getIds(`${ES_INDEX_PREFIX}-buyers`)
export const getSupplierIds = async () => await getIds(`${ES_INDEX_PREFIX}-suppliers`)

async function getItems(index, query = { match_all: {} }, from = 0, size = PAGE_SIZE) {

    const { body } = await es.search({
        index,
        body: {
            from,
            size,
            query,
        },
    })

    return body.hits || {}

}

export const getTenders = async () => await getItems(`${ES_INDEX_PREFIX}-tenders-*`)
export const searchForTenders = async (q, lang = defaultLanguage, page = 0) => (
    await getItems(
        `${ES_INDEX_PREFIX}-tenders-*`,
        q && { match_phrase: { [`appalto.${lang}`]: q } },
        page*PAGE_SIZE
    )
)

export const getBuyers = async () => await getItems(`${ES_INDEX_PREFIX}-buyers`)
export const searchForBuyers = async (q, lang = defaultLanguage, page = 0) => (
    await getItems(
        `${ES_INDEX_PREFIX}-buyers`,
        q && { match_phrase: { [`denominazione.${lang}`]: q } },
        page*PAGE_SIZE
    )
)

export const getSuppliers = async () => await getItems(`${ES_INDEX_PREFIX}-suppliers`)
export const searchForSuppliers = async (q, lang = defaultLanguage, page = 0) => (
    await getItems(
        `${ES_INDEX_PREFIX}-suppliers`,
        q && { match_phrase: { [`ragione sociale.${lang}`]: q } },
        page*PAGE_SIZE
    )
)

export const getTendersByBuyer = async (buyer, page = 0) => (
    await getItems(
        `${ES_INDEX_PREFIX}-tenders-*`,
        {
            term: {
                "pubblica amministrazione proponente.ID": { value: buyer }
            }
        },
        page*PAGE_SIZE
    )
)

export const getTendersCountByBuyer = async buyer => (
    await getCount(
        `${ES_INDEX_PREFIX}-tenders-*`,
        {
            term: {
                "pubblica amministrazione proponente.ID": { value: buyer }
            }
        }
    )
)

export const getRedflagsCountByBuyer = async buyer => (
    await getCount(
        `${ES_INDEX_PREFIX}-tenders-*`,
        {
            bool: {
                filter: {
                    term: {
                        "pubblica amministrazione proponente.ID": { value: buyer }
                    }
                },
                must: {
                    exists: {
                        field: "redflags.codice redflag"
                    }
                }
            }
        }
    )
)

export const getTendersBySupplier = async (supplier, page = 0) => (
    await getItems(
        `${ES_INDEX_PREFIX}-tenders-*`,
        {
            term: {
                "aggiudicatari.CF": { value: supplier }
            }
        },
        page*PAGE_SIZE
    )
)

export const getTendersCountBySupplier = async supplier => (
    await getCount(
        `${ES_INDEX_PREFIX}-tenders-*`,
        {
            term: {
                "aggiudicatari.CF": { value: supplier }
            }
        }
    )
)

async function getCount(index, query = { match_all: {} }) {

    const { body } = await es.count({
        index,
        body: {
            query,
        },
    })

    return body.count || 0

}

export const getTendersCount = async () => await getCount(`${ES_INDEX_PREFIX}-tenders-*`)
export const getBuyersCount = async () => await getCount(`${ES_INDEX_PREFIX}-buyers`)
export const getSuppliersCount = async () => await getCount(`${ES_INDEX_PREFIX}-suppliers`)

export const getRedflagsCount = async () => (
    await getCount(
        `${ES_INDEX_PREFIX}-tenders-*`,
        {
            exists: {
                field: "redflags"
            }
        }
    )
)

async function getAggs(index, filterKey, filterValue, aggValue) {

    const { body } = await es.search({
        index,
        body: {
            size: 0,
            aggs: {
                items: {
                    filter: { term: { [filterKey.join(".")]: filterValue } },
                    aggs: {
                        terms: {
                            terms: {
                                field: aggValue.join("."),
                                size: PAGE_SIZE
                            },
                            aggs: {
                                items: {
                                    top_hits: {
                                        size: 1
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    })

    return map(
        body.aggregations.items.terms.buckets,
        bucket => find(
            bucket.items.hits.hits[0]["_source"][aggValue[0]],
            item => item[aggValue[1]] === bucket.key
        )
    )

}

export const getSuppliersByBuyer = async buyer => (
    await getAggs(
        `${ES_INDEX_PREFIX}-tenders-*`,
        ["pubblica amministrazione proponente","ID"],
        buyer,
        ["aggiudicatari","CF"]
    )
)

export const getBuyersBySupplier = async supplier => (
    await getAggs(
        `${ES_INDEX_PREFIX}-tenders-*`,
        ["aggiudicatari","CF"],
        supplier,
        ["pubblica amministrazione proponente","ID"]
    )
)

export async function getTenderById(id, index) {

    if (!id) return {}

    if (index) {

        const { body } = await es.get({
            index,
            id,
        })

        return body["_source"] || {}
    
    } else {

        const { body } = await es.search({
            index,
            body: {
                query: {
                    ids: {
                        values: [id]
                    },
                },
            },
        })

        return !isEmpty(body.hits.hits) ? body.hits.hits[0]["_source"] : {}

    }

}

export async function getBuyerById(id) {

    if (!id) return {}

    const { body } = await es.get({
        index: `${ES_INDEX_PREFIX}-buyers`,
        id,
    })

    return body["_source"] || {}

}

export async function getSupplierById(id) {

    if (!id) return {}

    const { body } = await es.get({
        index: `${ES_INDEX_PREFIX}-suppliers`,
        id,
    })

    return body["_source"] || {}

}
