import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import {
  BuildingBlockFilterContext,
  BuildingBlockFilterDispatchContext
} from '../../../../components/context/BuildingBlockFilterContext'
import { QueryParamContext } from '../../../../components/context/QueryParamContext'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { parseQuery } from '../../utils/share'
import { ObjectType } from '../../utils/constants'
import BuildingBlockFilter from './BuildingBlockFilter'

const BuildingBlockListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { showMature, sdgs, useCases, workflows } = useContext(BuildingBlockFilterContext)
  const { setShowMature, setSDGs, setUseCases, setWorkflows } = useContext(BuildingBlockFilterDispatchContext)

  const { categoryTypes } = useContext(BuildingBlockFilterContext)
  const { setCategoryTypes } = useContext(BuildingBlockFilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/building-blocks'

    const showMatureFilter = showMature ? 'showMature=true' : ''
    const sdgFilters = sdgs.map((sdg) => `sdgs=${sdg.value}--${sdg.label}`)
    const useCaseFilters = useCases.map((useCase) => `useCases=${useCase.value}--${useCase.label}`)
    const workflowFilters = workflows.map((workflow) => `workflows=${workflow.value}--${workflow.label}`)
    const categoryTypeFilters = categoryTypes.map(
      (categoryType) => `categoryTypes=${categoryType.value}--${categoryType.label}`
    )

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter,
      showMatureFilter,
      ...sdgFilters,
      ...useCaseFilters,
      ...workflowFilters,
      ...categoryTypeFilters
    ]
      .filter((f) => f)
      .join('&')

    return `${baseUrl}${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query?.shareCatalog && Object.getOwnPropertyNames(query).length > 1 && !interactionDetected) {
      setShowMature(query.showMature === 'true')
      parseQuery(query, 'sdgs', sdgs, setSDGs)
      parseQuery(query, 'useCases', useCases, setUseCases)
      parseQuery(query, 'workflows', workflows, setWorkflows)
      parseQuery(query, 'categoryTypes', categoryTypes, setCategoryTypes)
    }
  })

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <BuildingBlockFilter />
        <Bookmark sharableLink={sharableLink} objectType={ObjectType.URL} />
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default BuildingBlockListLeft
