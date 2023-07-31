import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { BsPlus } from 'react-icons/bs'
import { useApolloClient } from '@apollo/client'
import Select from '../form/Select'
import { fetchSelectOptions } from '../../utils/search'
import { ORIGIN_SEARCH_QUERY } from '../query/origin'

export const OriginAutocomplete = ({ origins, setOrigins, placeholder }) => {
  const client = useApolloClient()

  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.origin.label') })

  const selectOrigin = (origin) => {
    setOrigins([...origins.filter(s => s.value !== origin.value), origin])
  }

  const fetchCallback = (data) => (
    data?.origins.map((origin) => ({
      label: origin.name,
      value: origin.id,
      slug: origin.slug
    }))
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <button className='flex' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-stratos text-sm ml-4 py-2'>
          {format('ui.origin.label')}
        </div>
        <BsPlus className='ml-auto' />
      </button>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format('ui.origin.label') })}
          className='ml-4 rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input) => fetchSelectOptions(client, input, ORIGIN_SEARCH_QUERY, fetchCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.origin.label') })}
          onChange={selectOrigin}
          placeholder={controlPlaceholder}
          value=''
        />
      }
    </div>
  )
}

export const OriginActiveFilters = ({ origins, setOrigins }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeOrigin = (originSlug) => {
    setOrigins(origins => [...origins.filter(origin => origin.slug !== originSlug)])
  }

  return (
    <>
      {origins?.map((origin, originIndex) => (
        <div key={originIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {origin.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.origin.label')})
              </div>
            </div>
            <button onClick={() => removeOrigin(origin.slug)}>
              <IoClose size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
