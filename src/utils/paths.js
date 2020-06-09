import { map, flatten, merge } from "lodash"

import { getI18nPaths } from "./i18n"

import { getTenderIds, getBuyerIds, getSupplierIds } from "./queries"

const getPaths = async (ids) =>
    flatten(
        map(getI18nPaths(), (i18nPath) =>
            map(ids, ({ id }) => merge({}, i18nPath, { params: { id } }))
        )
    )

export const getTenderPaths = async () => await getPaths(await getTenderIds())
export const getBuyerPaths = async () => await getPaths(await getBuyerIds())
export const getSupplierPaths = async () =>
    await getPaths(await getSupplierIds())
