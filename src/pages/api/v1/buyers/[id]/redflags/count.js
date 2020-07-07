import { getRedTendersCountByBuyer } from '../../../../../../utils/queries'

export default async (req, res) => {
  const {
    query: { id }
  } = req

  res.status(200).json(await getRedTendersCountByBuyer(id))
}
