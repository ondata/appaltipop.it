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

async function getItems(index) {

    const { body } = await es.search({
        index,
        body: {
            query: {
                match_all: {},
            },
        },
    })

    return body.hits.hits

}

export const getTenderItems = async () => await getItems(`${ES_INDEX_PREFIX}-tenders-*`)
export const getBuyerItems = async () => await getItems(`${ES_INDEX_PREFIX}-buyers`)
export const getSupplierItems = async () => await getItems(`${ES_INDEX_PREFIX}-suppliers`)

export const getTenders = async () => map(await getItems(`${ES_INDEX_PREFIX}-tenders-*`), "_source")
export const getBuyers = async () => map(await getItems(`${ES_INDEX_PREFIX}-buyers`), "_source")
export const getSuppliers = async () => map(await getItems(`${ES_INDEX_PREFIX}-suppliers`), "_source")

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
