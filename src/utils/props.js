import {
    merge,
    isArray,
} from 'lodash'

import {
    getI18nProps,
} from './i18n'

import {
    getTenderById,
    getBuyerById,
    getSupplierById,
    getTenders,
    getBuyers,
    getSuppliers,
} from './queries'

async function getProps(ctx, namespaces = ['common'], getCustomProps) {

    const i18nProps = await getI18nProps(ctx, namespaces)
    const customProps = await getCustomProps(ctx.params)

    return merge(
        {},
        i18nProps,
        {
            [isArray(customProps) ? "items" : "item"]: customProps
        },
    )
}

export const getTenderProps = async ctx => await getProps(ctx, ['common','tender'], getTenderById)
export const getBuyerProps = async ctx => await getProps(ctx, ['common','buyer'], getBuyerById)
export const getSupplierProps = async ctx => await getProps(ctx, ['common','supplier'], getSupplierById)

export const getTendersProps = async ctx => await getProps(ctx, ['common','tender'], getTenders)
export const getBuyersProps = async ctx => await getProps(ctx, ['common','buyer'], getBuyers)
export const getSuppliersProps = async ctx => await getProps(ctx, ['common','supplier'], getSuppliers)
