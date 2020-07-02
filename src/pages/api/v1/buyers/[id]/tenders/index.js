import { getTendersByBuyer } from '../../../../../../utils/queries'

export default async (req, res) => {
  const {
    query: { id, page }
  } = req

  res.status(200).json(await getTendersByBuyer(id, +page))
}
