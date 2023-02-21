import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import { QueryParamContext } from '../context/QueryParamContext'
import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../context/UseCaseFilterContext'
import { SDGFilters } from '../filter/element/SDG'
import { parseQuery } from '../shared/SharableLink'
import Pill from '../shared/Pill'
const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const UseCaseActiveFilter = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sdgs, showBeta } = useContext(UseCaseFilterContext)
  const { setSDGs, setShowBeta } = useContext(UseCaseFilterDispatchContext)

  const filterCount = () => {
    let count = sdgs.length
    count = showBeta ? count + 1 : count

    return count
  }

  const toggleShowBeta = () => {
    setShowBeta(!showBeta)
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setSDGs([])
    setShowBeta(false)
  }

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = 'use_cases'

    const showBetaFilter = showBeta ? 'showBeta=true' : ''
    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [activeFilter, showBetaFilter, ...sdgFilters].filter(f => f).join('&')

    return `${baseUrl}/${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog && !interactionDetected) {
      setShowBeta(query.showBeta === 'true')
      parseQuery(query, 'sdgs', sdgs, setSDGs)
    }
  })

  return (
    <div className={`flex flex-row pt-2 ${filterCount() > 0 ? 'block' : 'hidden'}`}>
      <div className='flex flex-row flex-wrap px-3 gap-2'>
        {showBeta && (
          <div className='py-1'>
            <Pill
              label={format('filter.useCase.showDraft')}
              onRemove={toggleShowBeta}
            />
          </div>
        )}
        <SDGFilters {...{ sdgs, setSDGs }} />

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

export default UseCaseActiveFilter
