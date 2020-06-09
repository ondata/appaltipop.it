import { getTendersBySupplier } from "../../../../../../utils/queries"

export default async (req, res) => {
    const {
        query: { id, page },
    } = req

    res.status(200).json(await getTendersBySupplier(id, +page))
}
