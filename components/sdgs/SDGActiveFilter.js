import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import { QueryParamContext } from '../context/QueryParamContext'
import { SDGFilterContext, SDGFilterDispatchContext } from '../context/SDGFilterContext'
import { SDGFilters } from '../filter/element/SDG'
import { parseQuery } from '../shared/SharableLink'
const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const SDGActiveFilter = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { sdgs } = useContext(SDGFilterContext)
  const { setSDGs } = useContext(SDGFilterDispatchContext)

  const filterCount = () => {
    return sdgs.length
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setSDGs([])
  }

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = 'sdgs'

    const sdgFilters = sdgs.map(sdg => `sdgs=${sdg.value}--${sdg.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [activeFilter, ...sdgFilters].filter(f => f).join('&')

    return `${baseUrl}/${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (query && Object.getOwnPropertyNames(query).length > 1 && query.shareCatalog && !interactionDetected) {
      parseQuery(query, 'sdgs', sdgs, setSDGs)
    }
  })

  return (
    <div className={`flex flex-row pt-2 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
      <div className='flex flex-row flex-wrap px-3 gap-2'>
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

export default SDGActiveFilter
