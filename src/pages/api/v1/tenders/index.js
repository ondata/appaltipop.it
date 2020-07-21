import { isEmpty } from 'lodash'

import { searchForTenders, postSearch } from '../../../../utils/queries'

export default async (req, res) => {
  const {
    query: {
      lang,
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
      page
    }
  } = req

  const query = {
    lang: lang || undefined,
    q: q || undefined,
    buyer: buyer || undefined,
    region: region || undefined,
    method: method || undefined,
    minAmount: !isEmpty(minAmount) ? +minAmount : undefined,
    maxAmount: !isEmpty(maxAmount) ? +maxAmount : undefined,
    minDate: minDate || undefined,
    maxDate: maxDate || undefined,
    minFlags: !isEmpty(minFlags) ? +minFlags : undefined,
    maxFlags: !isEmpty(maxFlags) ? +maxFlags : undefined,
    page: !isEmpty(page) ? +page : undefined
  }

  await postSearch(query)
  res.status(200).json(await searchForTenders(query))
}
