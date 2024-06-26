import { useCallback, useMemo, useState } from 'react'
import { BsDash, BsPlus } from 'react-icons/bs'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { generateResourceTypeOptions } from '../form/options'
import Select from '../form/Select'

export const ResourceTypeAutocomplete = ({ resourceTypes, setResourceTypes, placeholder, inline=false }) => {
  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.resource.type.label') })

  const selectResourceType = (resourceType) => {
    setResourceTypes([...resourceTypes.filter(({ value }) => value !== resourceType.value), resourceType])
  }

  const options = useMemo(() => generateResourceTypeOptions(format), [format])

  const loadOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  const toggleFilter = (event) => {
    event.preventDefault()
    setShowFilter(!showFilter)
  }

  return inline ? (
    <Select
      async
      isBorderless
      aria-label={format('filter.byEntity', { entity: format('ui.resource.type.label') })}
      className='rounded text-sm text-dial-gray-dark my-auto'
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.resource.type.label') })}
      onChange={selectResourceType}
      placeholder={controlPlaceholder}
      value=''
    />
  ) :(
    <div className='flex flex-col gap-y-3'>
      <a href='#' className='flex' onClick={toggleFilter}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.resource.type.label')}
        </div>
        {showFilter
          ? <BsDash className='ml-auto text-dial-stratos my-auto' />
          : <BsPlus className='ml-auto text-dial-stratos my-auto' />
        }
      </a>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format('ui.resource.type.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.resource.type.label') })}
          onChange={selectResourceType}
          placeholder={controlPlaceholder}
          value=''
        />
      }
    </div>
  )
}

export const ResourceTypeActiveFilters = ({ resourceTypes, setResourceTypes }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeResourceType = (resourceTypeSlug) => {
    setResourceTypes(resourceTypes =>
      [...resourceTypes.filter(resourceType => resourceType.slug !== resourceTypeSlug)]
    )
  }

  return (
    <>
      {resourceTypes?.map((resourceType, resourceTypeIndex) => (
        <div key={resourceTypeIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {resourceType.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.resource.type.label')})
              </div>
            </div>
            <button onClick={() => removeResourceType(resourceType.slug)}>
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
