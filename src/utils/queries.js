import es from './es'

import { map, isEmpty, find } from 'lodash'

import { ES_INDEX_PREFIX, PAGE_SIZE } from '../config/constants'

import { defaultLanguage } from '../config/i18n.json'

async function getIds (index) {
  const { body } = await es.search({
    index,
    stored_fields: [],
    body: {
      query: {
        match_all: {}
      }
    }
  })

  return map(body.hits.hits, (hit) => ({
    index: hit._index,
    id: hit._id
  }))
}

export const getTenderIds = async () =>
  await getIds(`${ES_INDEX_PREFIX}-tenders-*`)

export const getBuyerIds = async () => await getIds(`${ES_INDEX_PREFIX}-buyers-*`)

export const getSupplierIds = async () =>
  await getIds(`${ES_INDEX_PREFIX}-suppliers-*`)

async function getItems (
  index,
  query = { match_all: {} },
  from = 0,
  size = PAGE_SIZE,
  sort
) {
  const { body } = await es.search({
    index,
    body: {
      from,
      size,
      query
    },
    sort
  })

  return body.hits || {}
}

export const getTenders = async () =>
  await getItems(`${ES_INDEX_PREFIX}-tenders-*`)

export const getRegions = async () =>
  await getItems(`${ES_INDEX_PREFIX}-regions-*`)

export const searchForTenders = async ({
  q,
  buyer,
  region,
  method,
  minAmount,
  maxAmount,
  minDate,
  maxDate,
  minFlags,
  maxFlags,
  lang = defaultLanguage,
  page = 0
}) => {
  const filter = []

  if (buyer) {
    filter.push({
      term: {
        'appaltipop:releases/0/buyers.ocds:releases/0/buyer/id.raw': {
          value: buyer
        }
      }
    })
  }

  if (region) {
    filter.push({
      term: {
        'appaltipop:releases/0/buyers.istat:COD_REG': {
          value: region
        }
      }
    })
  }

  if (method) {
    filter.push({
      term: {
        'ocds:releases/0/tender/procurementMethodDetails': {
          value: method
        }
      }
    })
  }

  if (minAmount || maxAmount) {
    filter.push({
      range: {
        'ocds:releases/0/awards/0/value/amount': {
          gte: minAmount || undefined,
          lte: maxAmount || undefined
        }
      }
    })
  }

  if (minDate || maxDate) {
    if (minDate === maxDate) {
      filter.push({
        term: {
          'appaltipop:releases/0/tender/contractPeriod/dateRange': {
            value: minDate
          }
        }
      })
    } else {
      filter.push({
        range: {
          'appaltipop:releases/0/tender/contractPeriod/dateRange': {
            gte: minDate,
            lte: maxDate,
            relation: 'intersects'
          }
        }
      })
    }
  }

  if (minFlags || maxFlags) {
    if (minFlags === maxFlags) {
      filter.push({
        term: {
          'appaltipop:releases/0/redflags/count': {
            value: minFlags
          }
        }
      })
    } else {
      filter.push({
        range: {
          'appaltipop:releases/0/redflags/count': {
            gte: minFlags,
            lte: maxFlags
          }
        }
      })
    }
  }

  return await getItems(
    `${ES_INDEX_PREFIX}-tenders-*`,
    {
      bool: {
        filter,
        must: q ? {
          multi_match: {
            query: q,
            type: 'cross_fields',
            fields: [
              `ocds:releases/0/tender/title.${lang || defaultLanguage}`,
              'ocds:releases/0/id^4',
              `appaltipop:releases/0/buyers.ocds:releases/0/buyer/name.${lang || defaultLanguage}`,
              'appaltipop:releases/0/buyers.ocds:releases/0/parties/address/region',
              'appaltipop:releases/0/buyers.istat:DEN_CM'
            ]
          }
        } : {
          match_all: {}
        }
      }
    },
    (page || 0) * PAGE_SIZE,
    PAGE_SIZE,
    !q ? 'ocds:releases/0/tender/contractPeriod/startDate:desc' : undefined
  )
}

export const getRedflags = async () =>
  await getItems(`${ES_INDEX_PREFIX}-redflags`)

export const getBuyers = async () =>
  await getItems(`${ES_INDEX_PREFIX}-buyers-*`, { exists: { field: 'ocds:releases/0/parties/address/region' } }, 0, 100)

export const searchForBuyers = async (q, lang = defaultLanguage, page = 0) =>
  await getItems(
    `${ES_INDEX_PREFIX}-buyers-*`,
    q && {
      multi_match: {
        query: q,
        fields: [
          `ocds:releases/0/buyer/name.${lang}`,
          'ocds:releases/0/buyer/id'
        ]
      }
    },
    page * PAGE_SIZE
  )

export const getSuppliers = async () =>
  await getItems(`${ES_INDEX_PREFIX}-suppliers-*`)

export const searchForSuppliers = async (q, lang = defaultLanguage, page = 0) =>
  await getItems(
    `${ES_INDEX_PREFIX}-suppliers-*`,
    q && {
      multi_match: {
        query: q,
        fields: [
          `ocds:releases/0/parties/0/name.${lang}`,
          'ocds:releases/0/parties/0/id'
        ]
      }
    },
    page * PAGE_SIZE
  )

export const getTendersByBuyer = async (buyer, page = 0) =>
  await getItems(
    `${ES_INDEX_PREFIX}-tenders-*`,
    {
      term: {
        'appaltipop:releases/0/buyers.ocds:releases/0/buyer/id.raw': {
          value: buyer
        }
      }
    },
    page * PAGE_SIZE
  )

export const getTendersCountByBuyer = async (buyer) =>
  await getCount(`${ES_INDEX_PREFIX}-tenders-*`, {
    term: {
      'appaltipop:releases/0/buyers.ocds:releases/0/buyer/id.raw': {
        value: buyer
      }
    }
  })

export const getRedTendersCountByBuyer = async (buyer) =>
  await getCount(`${ES_INDEX_PREFIX}-tenders-*`, {
    bool: {
      filter: {
        term: {
          'appaltipop:releases/0/buyers.ocds:releases/0/buyer/id.raw': {
            value: buyer
          }
        }
      },
      must: {
        exists: {
          field: 'appaltipop:releases/0/redflags'
        }
      }
    }
  })

export const getTendersBySupplier = async (supplier, page = 0) =>
  await getItems(
    `${ES_INDEX_PREFIX}-tenders-*`,
    {
      term: {
        'appaltipop:releases/0/suppliers.ocds:releases/0/parties/0/id.raw': {
          value: supplier
        }
      }
    },
    page * PAGE_SIZE
  )

export const getTendersCountBySupplier = async (supplier) =>
  await getCount(`${ES_INDEX_PREFIX}-tenders-*`, {
    term: {
      'appaltipop:releases/0/suppliers.ocds:releases/0/parties/0/id.raw': {
        value: supplier
      }
    }
  })

export const getRedTendersCountBySupplier = async (supplier) =>
  await getCount(`${ES_INDEX_PREFIX}-tenders-*`, {
    bool: {
      filter: {
        term: {
          'appaltipop:releases/0/suppliers.ocds:releases/0/parties/0/id.raw': {
            value: supplier
          }
        }
      },
      must: {
        exists: {
          field: 'appaltipop:releases/0/redflags'
        }
      }
    }
  })

async function getCount (index, query = { match_all: {} }) {
  const { body } = await es.count({
    index,
    body: {
      query
    }
  })

  return body.count || 0
}

export const getTendersCount = async () =>
  await getCount(`${ES_INDEX_PREFIX}-tenders-*`)

export const getBuyersCount = async () =>
  await getCount(`${ES_INDEX_PREFIX}-buyers-*`)

export const getSuppliersCount = async () =>
  await getCount(`${ES_INDEX_PREFIX}-suppliers-*`)

export const getRedflagsCount = async () =>
  await getCount(`${ES_INDEX_PREFIX}-redflags`)

export const getRedTendersCount = async () =>
  await getCount(`${ES_INDEX_PREFIX}-tenders-*`, {
    exists: {
      field: 'appaltipop:releases/0/redflags'
    }
  })

async function getTerms (index, field) {
  const { body } = await es.search({
    index,
    body: {
      size: 0,
      aggs: {
        terms: {
          terms: {
            field,
            size: PAGE_SIZE
          }
        }
      }
    }
  })

  return body.aggregations.terms
}

export const getTenderMethods = async () =>
  await getTerms(
    `${ES_INDEX_PREFIX}-tenders-*`,
    'ocds:releases/0/tender/procurementMethodDetails'
  )

async function getSum (index, filterKey, filterValue, aggKey) {
  const { body } = await es.search({
    index,
    body: {
      size: 0,
      aggs: {
        items: {
          filter: { term: { [filterKey]: filterValue } },
          aggs: {
            sum: {
              sum: {
                field: aggKey
              }
            }
          }
        }
      }
    }
  })

  return body.aggregations.items.sum.value
}

export const getTendersValueAmountByBuyer = async (buyer) =>
  await getSum(
    `${ES_INDEX_PREFIX}-tenders-*`,
    'appaltipop:releases/0/buyers.ocds:releases/0/buyer/id.raw',
    buyer,
    'ocds:releases/0/awards/0/value/amount'
  )

export const getTendersTransactionAmountByBuyer = async (buyer) =>
  await getSum(
    `${ES_INDEX_PREFIX}-tenders-*`,
    'appaltipop:releases/0/buyers.ocds:releases/0/buyer/id.raw',
    buyer,
    'ocds:releases/0/contracts/0/implementation/transactions/0/value/amount'
  )

export const getTendersValueAmountBySupplier = async (supplier) =>
  await getSum(
    `${ES_INDEX_PREFIX}-tenders-*`,
    'appaltipop:releases/0/suppliers.ocds:releases/0/parties/0/id.raw',
    supplier,
    'ocds:releases/0/awards/0/value/amount'
  )

export const getTendersTransactionAmountBySupplier = async (supplier) =>
  await getSum(
    `${ES_INDEX_PREFIX}-tenders-*`,
    'appaltipop:releases/0/suppliers.ocds:releases/0/parties/0/id.raw',
    supplier,
    'ocds:releases/0/contracts/0/implementation/transactions/0/value/amount'
  )

async function getAggs (index, filterKey, filterValue, aggValue) {
  const { body } = await es.search({
    index,
    body: {
      size: 0,
      aggs: {
        items: {
          filter: { term: { [filterKey]: filterValue } },
          aggs: {
            terms: {
              terms: {
                field: aggValue,
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

  return map(body.aggregations.items.terms.buckets, (bucket) =>
    find(
      bucket.items.hits.hits[0]._source[aggValue[0]],
      (item) => item[aggValue[1]] === bucket.key
    )
  )
}

export const getSuppliersByBuyer = async (buyer) =>
  await getAggs(
    `${ES_INDEX_PREFIX}-tenders-*`,
    'appaltipop:releases/0/buyers.ocds:releases/0/buyer/id.raw',
    buyer,
    'appaltipop:releases/0/suppliers.ocds:releases/0/parties/0/id'
  )

export const getBuyersBySupplier = async (supplier) =>
  await getAggs(
    `${ES_INDEX_PREFIX}-tenders-*`,
    'appaltipop:releases/0/suppliers.ocds:releases/0/parties/0/id.raw',
    supplier,
    'appaltipop:releases/0/buyers.ocds:releases/0/buyer/id'
  )

async function getMinMax (index, aggKey) {
  const { body } = await es.search({
    index,
    body: {
      size: 0,
      aggs: {
        min: {
          min: {
            field: aggKey
          }
        },
        max: {
          max: {
            field: aggKey
          }
        }
      }
    }
  })

  return [
    body.aggregations.min.value,
    body.aggregations.max.value
  ]
}

export const getMinMaxAmount = async () =>
  await getMinMax(
    `${ES_INDEX_PREFIX}-tenders-*`,
    'ocds:releases/0/awards/0/value/amount'
  )

export async function getTenderById (id, index) {
  if (!id) return {}

  if (index) {
    const { body } = await es.get({
      index,
      id
    })

    return body._source || {}
  } else {
    const { body } = await es.search({
      index: `${ES_INDEX_PREFIX}-tenders-*`,
      body: {
        query: {
          ids: {
            values: [id]
          }
        }
      }
    })

    return !isEmpty(body.hits.hits) ? body.hits.hits[0]._source : {}
  }
}

export async function getBuyerById (id, index) {
  if (!id) return {}

  if (index) {
    const { body } = await es.get({
      index,
      id
    })

    return body._source || {}
  } else {
    const { body } = await es.search({
      index: `${ES_INDEX_PREFIX}-buyers-*`,
      body: {
        query: {
          ids: {
            values: [id]
          }
        }
      }
    })

    return !isEmpty(body.hits.hits) ? body.hits.hits[0]._source : {}
  }
}

export async function getSupplierById (id, index) {
  if (!id) return {}

  if (index) {
    const { body } = await es.get({
      index,
      id
    })

    return body._source || {}
  } else {
    const { body } = await es.search({
      index: `${ES_INDEX_PREFIX}-suppliers-*`,
      body: {
        query: {
          ids: {
            values: [id]
          }
        }
      }
    })

    return !isEmpty(body.hits.hits) ? body.hits.hits[0]._source : {}
  }
}

export async function postSearch (hit = {}) {
  const timestamp = hit.timestamp ? new Date(hit.timestamp) : new Date()
  await es.index({
    index: `${ES_INDEX_PREFIX}-searches-${timestamp.getFullYear()}`,
    body: {
      ...hit,
      timestamp: timestamp.getTime()
    }
  })
}
