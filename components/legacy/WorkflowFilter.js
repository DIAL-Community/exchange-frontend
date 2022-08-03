import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { QueryParamContext } from '../context/QueryParamContext'
import { WorkflowFilterContext, WorkflowFilterDispatchContext } from '../context/WorkflowFilterContext'
import { SDGAutocomplete, SDGFilters } from '../filter/element/SDG'
import { UseCaseAutocomplete, UseCaseFilters } from '../filter/element/UseCase'
import { parseQuery } from '../shared/SharableLink'
const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const WorfklowFilter = (props) => {
  const filterDisplayed = props.filterDisplayed

  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

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
    <div className='px-2'>
      {
        filterDisplayed &&
          <div className='grid grid-cols-11 gap-4 pb-4 pt-2'>
            <div className='col-span-11 lg:col-span-5'>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='text-white text-xl px-2 pb-3'>
                  {format('filter.framework.title').toUpperCase()}
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='pl-2 pr-4 pb-2'>
                  {format('filter.framework.subTitle', { entity: format('workflow.header') })}
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' />
                <UseCaseAutocomplete {...{ useCases, setUseCases }} containerStyles='px-2 pb-2' />
              </div>
            </div>
          </div>
      }
      <div className={`flex flex-row pb-4 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          {format('filter.general.applied', { count: filterCount() })}:
        </div>
        <div className='flex flex-row flex-wrap gap-2'>
          <SDGFilters {...{ sdgs, setSDGs }} />
          <UseCaseFilters {...{ useCases, setUseCases }} />

          <div className='flex px-2 py-1 mt-2 text-sm text-white'>
            <a className='border-b-2 border-transparent hover:border-dial-yellow my-auto' href='#clear-filter' onClick={clearFilter}>
              {format('filter.general.clearAll')}
            </a>
            <div className='border-r border-white mx-2 opacity-50' />
            <SharableLink sharableLink={sharableLink} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorfklowFilter
