import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import { QueryParamContext } from '../../context/QueryParamContext'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import { parseQuery } from '../../utils/share'
import UseCaseFilter from './UseCaseFilter'

const UseCaseListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { sdgs, showBeta, showGovStackOnly } = useContext(FilterContext)
  const { setSdgs, setShowBeta, setShowGovStackOnly } = useContext(FilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/use-cases'

    const showBetaFilter = showBeta ? 'showBeta=true' : ''
    const showGovStackOnlyFilter = showGovStackOnly ? 'showGovStackOnly=true' : ''
    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter,
      showBetaFilter,
      showGovStackOnlyFilter,
      ...sdgFilters
    ].filter(f => f).join('&')

    return `${baseUrl}${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query?.shareCatalog && Object.getOwnPropertyNames(query).length > 1 && !interactionDetected) {
      setShowBeta(query.showBeta === 'true')
      setShowGovStackOnly(query.showGovStackOnly === 'true')
      parseQuery(query, 'sdgs', sdgs, setSdgs)
    }
  })

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <UseCaseFilter />
        <Bookmark sharableLink={sharableLink} objectType={ObjectType.URL} />
        <hr className='border-b border-dial-slate-200' />
        <Share />
        <hr className='border-b border-dial-slate-200' />
      </div>
    </div>
  )
}

export default UseCaseListLeft
