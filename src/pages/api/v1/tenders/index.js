import { isEmpty } from 'lodash'

import { searchForTenders } from '../../../../utils/queries'

export default async (req, res) => {
  const {
    query: {
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
      lang,
      page
    }
  } = req

  res.status(200).json(
    await searchForTenders({
      q,
      buyer,
      region,
      method,
      minAmount: !isEmpty(minAmount) ? +minAmount : undefined,
      maxAmount: !isEmpty(maxAmount) ? +maxAmount : undefined,
      minDate,
      maxDate,
      minFlags: !isEmpty(minFlags) ? +minFlags : undefined,
      maxFlags: !isEmpty(maxFlags) ? +maxFlags : undefined,
      lang,
      page: !isEmpty(page) ? +page : undefined
    })
  )
}
