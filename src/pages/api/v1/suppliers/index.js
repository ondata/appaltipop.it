import {
    searchForSuppliers,
} from '../../../../utils/queries'

export default async (req, res) => {

    const { query: { q, lang, page } } = req

    res
        .status(200)
        .json(await searchForSuppliers(q, lang, page))

}