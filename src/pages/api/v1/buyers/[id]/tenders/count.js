import { getTendersCountByBuyer } from "../../../../../../utils/queries"

export default async (req, res) => {
    const {
        query: { id },
    } = req

    res.status(200).json(await getTendersCountByBuyer(id))
}
