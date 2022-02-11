import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'

import { QueryParamContext } from '../context/QueryParamContext'
import { WorkflowFilterContext, WorkflowFilterDispatchContext } from '../context/WorkflowFilterContext'
import { SDGFilters } from '../filter/element/SDG'
import { parseQuery } from '../shared/SharableLink'

import dynamic from 'next/dynamic'
import { UseCaseFilters } from '../filter/element/UseCase'
const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const WorkflowActiveFilter = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { sdgs, useCases } = useContext(WorkflowFilterContext)
  const { setSDGs, setUseCases } = useContext(WorkflowFilterDispatchContext)

  const filterCount = () => {
    return sdgs.length + useCases.length
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setSDGs([])
    setUseCases([])
  }

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = 'workflows'

    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)
    const useCaseFilters = useCases.map(useCase => `useCases=${useCase.value}--${useCase.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [activeFilter, ...sdgFilters, ...useCaseFilters].filter(f => f).join('&')
    return `${baseUrl}/${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog && !interactionDetected) {
      parseQuery(query, 'sdgs', sdgs, setSDGs)
      parseQuery(query, 'useCases', useCases, setUseCases)
    }
  })

  return (
    <div className={`flex flex-row pt-2 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
      <div className='flex flex-row flex-wrap px-3'>
        <SDGFilters {...{ sdgs, setSDGs }} />
        <UseCaseFilters {...{ useCases, setUseCases }} />

        <div className='flex px-2 py-1 mt-2 text-sm text-dial-gray-dark'>
          <a
            className='border-b-2 border-transparent hover:border-dial-yellow my-auto opacity-50'
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

export default WorkflowActiveFilter