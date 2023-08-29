import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'
import { BsPlus } from 'react-icons/bs'
import { useApolloClient } from '@apollo/client'
import Select from '../form/Select'
import { fetchSelectOptions } from '../../utils/search'
import { SDG_SEARCH_QUERY } from '../query/sdg'

export const SdgAutocomplete = ({ sdgs, setSdgs, placeholder }) => {
  const client = useApolloClient()

  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.sdg.label') })

  const selectSdg = (sdg) => {
    setSdgs([...sdgs.filter(s => s.value !== sdg.value), sdg])
  }

  const fetchCallback = (data) => (
    data?.sdgs.map((sdg) => ({
      label: `${sdg.number}. ${sdg.name}`,
      value: sdg.id,
      number: sdg.number,
      slug: sdg.slug
    }))
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <button type='button' className='flex' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.sdg.label')}
        </div>
        <BsPlus className='ml-auto text-dial-stratos my-auto' />
      </button>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format('ui.sdg.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input) => fetchSelectOptions(client, input, SDG_SEARCH_QUERY, fetchCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.sdg.label') })}
          onChange={selectSdg}
          placeholder={controlPlaceholder}
          value=''
        />
      }
    </div>
  )
}

export const SdgActiveFilters = ({ sdgs, setSdgs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeSdg = (sdgSlug) => {
    setSdgs(sdgs => [...sdgs.filter(sdg => sdg.slug !== sdgSlug)])
  }

  return (
    <>
      {sdgs?.map((sdg, sdgIndex) => (
        <div key={sdgIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {sdg.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.sdg.label')})
              </div>
            </div>
            <button onClick={() => removeSdg(sdg.slug)}>
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
