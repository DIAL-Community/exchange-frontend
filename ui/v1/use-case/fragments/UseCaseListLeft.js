import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import Bookmark from '../../shared/common/Bookmark'
import Comment from '../../shared/common/Comment'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import { QueryParamContext } from '../../../../components/context/QueryParamContext'
import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../../../../components/context/UseCaseFilterContext'
import { parseQuery } from '../../utils/share'
import UseCaseFilter from './UseCaseFilter'

const UseCaseListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { sdgs, showBeta, govStackOnly } = useContext(UseCaseFilterContext)
  const { setSdgs, setShowBeta, setShowGovStack } = useContext(UseCaseFilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/use-cases'

    const showBetaFilter = showBeta ? 'showBeta=true' : ''
    const govStackOnlyFilter = govStackOnly ? 'govStackOnly=true' : ''
    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter,
      showBetaFilter,
      govStackOnlyFilter,
      ...sdgFilters
    ].filter(f => f).join('&')

    return `${baseUrl}${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query?.shareCatalog &&  Object.getOwnPropertyNames(query).length > 1 && !interactionDetected) {
      setShowBeta(query.showBeta === 'true')
      setShowGovStack(query.govStackOnly === 'true')
      parseQuery(query, 'sdgs', sdgs, setSdgs)
    }
  })

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <UseCaseFilter />
        <hr className='bg-slate-200'/>
        <Bookmark sharableLink={sharableLink} objectType={ObjectType.URL}/>
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default UseCaseListLeft
