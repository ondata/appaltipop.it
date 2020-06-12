import { getTenderById } from "../../../../../utils/queries"

export default async (req, res) => {

    const {
        query: { id },
    } = req

    const tender = await getTenderById(id)

    res.status(200).json(tender["appaltipop:releases/0/buyers"] || [])
}
