import es from "./es"

import { map, isEmpty, find } from "lodash"

import { ES_INDEX_PREFIX, PAGE_SIZE } from "../config/constants"

import { defaultLanguage } from "../config/i18n.json"

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

    return map(body.hits.hits, (hit) => ({
        index: hit["_index"],
        id: hit["_id"],
    }))
}

export const getTenderIds = async () =>
    await getIds(`${ES_INDEX_PREFIX}-tenders-*`)

export const getBuyerIds = async () => await getIds(`${ES_INDEX_PREFIX}-buyers`)

export const getSupplierIds = async () =>
    await getIds(`${ES_INDEX_PREFIX}-suppliers`)

async function getItems(
    index,
    query = { match_all: {} },
    from = 0,
    size = PAGE_SIZE
) {
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

export const getTenders = async () =>
    await getItems(`${ES_INDEX_PREFIX}-tenders-*`)

export const searchForTenders = async (
    q,
    flags = 0,
    lang = defaultLanguage,
    page = 0
) =>
    await getItems(
        `${ES_INDEX_PREFIX}-tenders-*`,
        q && {
            bool: {
                filter: !!flags
                    ? {
                          exists: {
                              field: "appaltipop:releases/0/redflags",
                          },
                      }
                    : { match_all: {} },
                must: {
                    multi_match: {
                        query: q,
                        fields: [
                            `ocds:releases/0/tender/title.${lang}`,
                            `ocds:releases/0/id`,
                        ],
                    },
                },
            },
        },
        page * PAGE_SIZE
    )

export const getBuyers = async () => await getItems(`${ES_INDEX_PREFIX}-buyers`)

export const searchForBuyers = async (q, lang = defaultLanguage, page = 0) =>
    await getItems(
        `${ES_INDEX_PREFIX}-buyers`,
        q && {
            multi_match: {
                query: q,
                fields: [
                    `ocds:releases/0/buyer/name.${lang}`,
                    `ocds:releases/0/buyer/id`,
                ],
            },
        },
        page * PAGE_SIZE
    )

export const getSuppliers = async () =>
    await getItems(`${ES_INDEX_PREFIX}-suppliers`)

export const searchForSuppliers = async (q, lang = defaultLanguage, page = 0) =>
    await getItems(
        `${ES_INDEX_PREFIX}-suppliers`,
        q && {
            multi_match: {
                query: q,
                fields: [
                    `ocds:releases/0/parties/0/name.${lang}`,
                    `ocds:releases/0/parties/0/id`,
                ],
            },
        },
        page * PAGE_SIZE
    )

export const getTendersByBuyer = async (buyer, page = 0) =>
    await getItems(
        `${ES_INDEX_PREFIX}-tenders-*`,
        {
            term: {
                "appaltipop:releases/0/buyers.ocds:releases/0/buyer/id": {
                    value: buyer,
                },
            },
        },
        page * PAGE_SIZE
    )

export const getTendersCountByBuyer = async (buyer) =>
    await getCount(`${ES_INDEX_PREFIX}-tenders-*`, {
        term: {
            "appaltipop:releases/0/buyers.ocds:releases/0/buyer/id": {
                value: buyer,
            },
        },
    })

export const getRedflagsCountByBuyer = async (buyer) =>
    await getCount(`${ES_INDEX_PREFIX}-tenders-*`, {
        bool: {
            filter: {
                term: {
                    "appaltipop:releases/0/buyers.ocds:releases/0/buyer/id": {
                        value: buyer,
                    },
                },
            },
            must: {
                exists: {
                    field: "appaltipop:releases/0/redflags",
                },
            },
        },
    })

export const getTendersBySupplier = async (supplier, page = 0) =>
    await getItems(
        `${ES_INDEX_PREFIX}-tenders-*`,
        {
            term: {
                "appaltipop:releases/0/suppliers.ocds:releases/0/parties/0/id": {
                    value: supplier,
                },
            },
        },
        page * PAGE_SIZE
    )

export const getTendersCountBySupplier = async (supplier) =>
    await getCount(`${ES_INDEX_PREFIX}-tenders-*`, {
        term: {
            "appaltipop:releases/0/suppliers.ocds:releases/0/parties/0/id": {
                value: supplier,
            },
        },
    })

export const getRedflagsCountBySupplier = async (supplier) =>
    await getCount(`${ES_INDEX_PREFIX}-tenders-*`, {
        bool: {
            filter: {
                term: {
                    "appaltipop:releases/0/suppliers.ocds:releases/0/parties/0/id": {
                        value: supplier,
                    },
                },
            },
            must: {
                exists: {
                    field: "appaltipop:releases/0/redflags",
                },
            },
        },
    })

async function getCount(index, query = { match_all: {} }) {
    const { body } = await es.count({
        index,
        body: {
            query,
        },
    })

    return body.count || 0
}

export const getTendersCount = async () =>
    await getCount(`${ES_INDEX_PREFIX}-tenders-*`)

export const getBuyersCount = async () =>
    await getCount(`${ES_INDEX_PREFIX}-buyers`)

export const getSuppliersCount = async () =>
    await getCount(`${ES_INDEX_PREFIX}-suppliers`)

export const getRedflagsCount = async () =>
    await getCount(`${ES_INDEX_PREFIX}-tenders-*`, {
        exists: {
            field: "appaltipop:releases/0/redflags",
        },
    })

async function getSum(filterKey, filterValue, aggKey) {
    const { body } = await es.search({
        index: `${ES_INDEX_PREFIX}-tenders-*`,
        body: {
            size: 0,
            aggs: {
                items: {
                    filter: { term: { [filterKey.join(".")]: filterValue } },
                    aggs: {
                        sum: {
                            sum: {
                                field: aggKey,
                            },
                        },
                    },
                },
            },
        },
    })

    return body.aggregations.items.sum.value
}

export const getTendersValueAmountByBuyer = async (buyer) =>
    await getSum(
        ["appaltipop:releases/0/buyers", "ocds:releases/0/buyer/id"],
        buyer,
        "ocds:releases/0/awards/0/value/amount"
    )

export const getTendersTransactionAmountByBuyer = async (buyer) =>
    await getSum(
        ["appaltipop:releases/0/buyers", "ocds:releases/0/buyer/id"],
        buyer,
        "ocds:releases/0/contracts/0/implementation/transactions/0/value/amount"
    )

export const getTendersValueAmountBySupplier = async (supplier) =>
    await getSum(
        ["appaltipop:releases/0/suppliers", "ocds:releases/0/parties/0/id"],
        supplier,
        "ocds:releases/0/awards/0/value/amount"
    )

export const getTendersTransactionAmountBySupplier = async (supplier) =>
    await getSum(
        ["appaltipop:releases/0/suppliers", "ocds:releases/0/parties/0/id"],
        supplier,
        "ocds:releases/0/contracts/0/implementation/transactions/0/value/amount"
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
                                size: PAGE_SIZE,
                            },
                            aggs: {
                                items: {
                                    top_hits: {
                                        size: 1,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    })

    return map(body.aggregations.items.terms.buckets, (bucket) =>
        find(
            bucket.items.hits.hits[0]["_source"][aggValue[0]],
            (item) => item[aggValue[1]] === bucket.key
        )
    )
}

export const getSuppliersByBuyer = async (buyer) =>
    await getAggs(
        `${ES_INDEX_PREFIX}-tenders-*`,
        ["appaltipop:releases/0/buyers", "ocds:releases/0/buyer/id"],
        buyer,
        ["appaltipop:releases/0/suppliers", "ocds:releases/0/parties/0/id"]
    )

export const getBuyersBySupplier = async (supplier) =>
    await getAggs(
        `${ES_INDEX_PREFIX}-tenders-*`,
        ["appaltipop:releases/0/suppliers", "ocds:releases/0/parties/0/id"],
        supplier,
        ["appaltipop:releases/0/buyers", "ocds:releases/0/buyer/id"]
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
                        values: [id],
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
