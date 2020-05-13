import {
    merge,
} from 'lodash'

import {
    getI18nProps,
} from './i18n'

import {
    getTenderById,
    getBuyerById,
    getSupplierById,
} from './queries'

const getProps = async (ctx, namespaces = ['common'], byId) => (
    merge(
        {},
        await getI18nProps(ctx, namespaces),
        await byId(ctx.params.id),
    )
)

export const getTenderProps = async ctx => await getProps(ctx, ['common','tender'], getTenderById)
export const getBuyerProps = async ctx => await getProps(ctx, ['common','buyer'], getBuyerById)
export const getSupplierProps = async ctx => await getProps(ctx, ['common','supplier'], getSupplierById)
