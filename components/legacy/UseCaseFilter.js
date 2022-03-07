import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { MdClose } from 'react-icons/md'

import { QueryParamContext } from '../context/QueryParamContext'
import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../context/UseCaseFilterContext'
import { SDGAutocomplete, SDGFilters } from '../filter/element/SDG'

import { parseQuery } from '../shared/SharableLink'

import dynamic from 'next/dynamic'
const SharableLink = dynamic(() => import('../shared/SharableLink'), { ssr: false })

const UseCaseFilter = (props) => {
  const filterDisplayed = props.filterDisplayed

  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

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
    <div className='px-2'>
      {
        filterDisplayed &&
          <div className='grid grid-cols-11 gap-4 pb-4 pt-2'>
            <div className='col-span-11 lg:col-span-4 border-transparent border-r lg:border-dial-purple-light'>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='text-white text-xl px-2 pb-3'>
                  {format('filter.framework.title').toUpperCase()}
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='pl-2 pr-4 pb-2'>
                  {format('filter.framework.subTitle', { entity: format('useCase.header') })}
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' />
              </div>
            </div>

            <div className='col-span-11 lg:col-span-5'>
              <div className='text-white text-xl px-2 pb-3'>
                {format('filter.entity', { entity: format('useCase.label') }).toUpperCase()}
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='px-2 pb-2'>
                  <label className='inline-flex items-center'>
                    <input
                      type='checkbox' className='h-4 w-4 form-checkbox text-white' name='show-beta'
                      checked={showBeta} onChange={toggleShowBeta}
                    />
                    <span className='ml-2'>{format('filter.useCase.showBeta')}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
      }
      <div className={`flex flex-row pb-4 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          {format('filter.general.applied', { count: filterCount() })}:
        </div>
        <div className='flex flex-row flex-wrap'>
          {
            showBeta &&
              <div className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
                {format('filter.useCase.showBeta')}
                <MdClose className='ml-3 inline cursor-pointer' onClick={toggleShowBeta} />
              </div>
          }
          <SDGFilters {...{ sdgs, setSDGs }} />

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

export default UseCaseFilter
