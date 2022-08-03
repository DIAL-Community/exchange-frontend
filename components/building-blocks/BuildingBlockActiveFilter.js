import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import { QueryParamContext } from '../context/QueryParamContext'
import { BuildingBlockFilterContext, BuildingBlockFilterDispatchContext } from '../context/BuildingBlockFilterContext'
import { SDGFilters } from '../filter/element/SDG'
import { UseCaseFilters } from '../filter/element/UseCase'
import { WorkflowFilters } from '../filter/element/Workflow'
import { parseQuery } from '../shared/SharableLink'
import Pill from '../shared/Pill'

const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const BuildingBlockActiveFilter = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { showMature, sdgs, useCases, workflows } = useContext(BuildingBlockFilterContext)
  const { setShowMature, setSDGs, setUseCases, setWorkflows } = useContext(BuildingBlockFilterDispatchContext)

  const filterCount = () => {
    let count = 0
    if (showMature) {
      count = count + 1
    }

    count = count + sdgs.length + useCases.length + workflows.length
    
    return count
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setShowMature(false)
    setSDGs([])
    setUseCases([])
    setWorkflows([])
  }

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = 'building_blocks'

    const showMatureFilter = showMature ? 'showMature=true' : ''
    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)
    const useCaseFilters = useCases.map(useCase => `useCases=${useCase.value}--${useCase.label}`)
    const workflowFilters = workflows.map(workflow => `workflows=${workflow.value}--${workflow.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [activeFilter, showMatureFilter, ...sdgFilters, ...useCaseFilters, ...workflowFilters].filter(f => f).join('&')

    return `${baseUrl}/${basePath}?${filterParameters}`
  }

  const toggleWithMaturity = () => {
    setShowMature(!showMature)
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog && !interactionDetected) {
      setShowMature(query.showMature === 'true')
      parseQuery(query, 'sdgs', sdgs, setSDGs)
      parseQuery(query, 'useCases', useCases, setUseCases)
      parseQuery(query, 'workflows', workflows, setWorkflows)
    }
  })

  return (
    <div className={`flex flex-row pt-2 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
      <div className='flex flex-row flex-wrap px-3 gap-2'>
        {showMature && (
          <div className='py-1'>
            <Pill
              label={format('filter.buildingBlock.matureOnly')}
              onRemove={toggleWithMaturity}
            />
          </div>
        )}
        <SDGFilters {...{ sdgs, setSDGs }} />
        <UseCaseFilters {...{ useCases, setUseCases }} />
        <WorkflowFilters {...{ workflows, setWorkflows }} />

        <div className='flex px-2 py-1 mt-2 text-sm text-dial-gray-dark'>
          <a
            className='border-b-2 border-transparent hover:border-dial-yellow opacity-50'
            href='#clear-filter' onClick={clearFilter}
          >
            {format('filter.general.clearAll')}
          </a>
          <div className='border-r border-dial-gray mx-2 opacity-50' />
          <SharableLink sharableLink={sharableLink} />
        </div>
      </div>
    </div>
  )
}

export default BuildingBlockActiveFilter
