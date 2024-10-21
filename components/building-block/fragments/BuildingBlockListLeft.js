import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import { QueryParamContext } from '../../context/QueryParamContext'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import { parseQuery } from '../../utils/share'
import BuildingBlockFilter from './BuildingBlockFilter'

const BuildingBlockListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const {
    categoryTypes,
    sdgs,
    showGovStackOnly,
    showMature,
    useCases,
    workflows
  } = useContext(FilterContext)

  const {
    setCategoryTypes,
    setSdgs,
    setShowGovStackOnly,
    setShowMature,
    setUseCases,
    setWorkflows
  } = useContext(FilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/building-blocks'

    const categoryTypeFilters = categoryTypes.map(
      (categoryType) => `categoryTypes=${categoryType.value}--${categoryType.label}`
    )

    const sdgFilters = sdgs.map((sdg) => `sdgs=${sdg.value}--${sdg.label}`)
    const showGovStackOnlyFilter = showGovStackOnly ? 'showGovStackOnly=true' : ''
    const showMatureFilter = showMature ? 'showMature=true' : ''
    const useCaseFilters = useCases.map((useCase) => `useCases=${useCase.value}--${useCase.label}`)
    const workflowFilters = workflows.map((workflow) => `workflows=${workflow.value}--${workflow.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter,
      ...categoryTypeFilters,
      ...sdgFilters,
      showGovStackOnlyFilter,
      showMatureFilter,
      ...useCaseFilters,
      ...workflowFilters
    ].filter((f) => f).join('&')

    return `${baseUrl}${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query?.shareCatalog && Object.getOwnPropertyNames(query).length > 1 && !interactionDetected) {
      setShowMature(query.showMature === 'true')
      setShowGovStackOnly(query.showGovStackOnly === 'true')
      parseQuery(query, 'sdgs', sdgs, setSdgs)
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
        <hr className='border-b border-dial-slate-200' />
        <Share />
        <hr className='border-b border-dial-slate-200' />
      </div>
    </div>
  )
}

export default BuildingBlockListLeft
