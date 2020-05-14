import es from './es'

import {
    map,
    isEmpty,
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
