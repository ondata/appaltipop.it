import es from './es'

import {
    map,
    isEmpty,
    find,
} from 'lodash'

import {
    ES_INDEX_PREFIX,
} from '../config/constants'

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

async function getItems(index, query = { match_all: {} }) {

    const { body } = await es.search({
        index,
        body: {
            query,
        },
    })

    return body.hits.hits || []

}

export const getTenders = async () => map(await getItems(`${ES_INDEX_PREFIX}-tenders-*`), "_source")
export const getBuyers = async () => map(await getItems(`${ES_INDEX_PREFIX}-buyers`), "_source")
export const getSuppliers = async () => map(await getItems(`${ES_INDEX_PREFIX}-suppliers`), "_source")

export const getTendersByBuyer = async buyer => map(
    await getItems(
        `${ES_INDEX_PREFIX}-tenders-*`,
        {
            term: {
                "pubblica amministrazione proponente.ID": { value: buyer }
            }
        }
    ),
    "_source"
)

export const getTendersBySupplier = async supplier => map(
    await getItems(
        `${ES_INDEX_PREFIX}-tenders-*`,
        {
            term: {
                "aggiudicatari.CF": { value: supplier }
            }
        }
    ),
    "_source"
)

async function getCounts(index, query = { match_all: {} }) {

    const { body } = await es.count({
        index,
        body: {
            query,
        },
    })

    return body.count || 0

}

export const getTenderCounts = async () => await getCounts(`${ES_INDEX_PREFIX}-tenders-*`)
export const getBuyerCounts = async () => await getCounts(`${ES_INDEX_PREFIX}-buyers`)
export const getSupplierCounts = async () => await getCounts(`${ES_INDEX_PREFIX}-suppliers`)

async function getAggs(index, filterKey, filterValue, aggValue) {

    const { body } = await es.search({
        index,
        body: {
            "size": 0,
            "aggs": {
                "items": {
                    "filter": { "term": { [filterKey.join(".")]: filterValue } },
                    "aggs": {
                        "terms": {
                            "terms": {
                                "field": aggValue.join("."),
                                "size": 10
                            },
                            "aggs": {
                                "items": {
                                    "top_hits": {
                                        "size": 1
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
