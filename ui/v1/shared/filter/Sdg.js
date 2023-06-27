import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { BsPlus } from 'react-icons/bs'
import { useApolloClient } from '@apollo/client'
import Select from '../form/Select'
import { fetchSelectOptions } from '../../utils/search'
import { SDG_SEARCH_QUERY } from '../../../../queries/sdg'

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
      slug: sdg.slug
    }))
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <button className='flex' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-stratos text-sm ml-4'>SDG</div>
        <BsPlus className='ml-auto' />
      </button>
      {showFilter &&
        <Select
          async
          aria-label={format('filter.byEntity', { entity: format('ui.sdg.label') })}
          className='ml-4 rounded text-sm text-dial-gray-dark my-auto'
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
            <div className='flex gap-x-1'>
              {sdg.label}
              <div className='inline opacity-40'>
                ({format('ui.sdg.label')})
              </div>
            </div>
            <button onClick={() => removeSdg(sdg.slug)}>
              <IoClose size='1rem' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
