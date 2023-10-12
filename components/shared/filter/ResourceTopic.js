import { useIntl } from 'react-intl'
import { useCallback, useMemo, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'
import { BsDash, BsPlus } from 'react-icons/bs'
import Select from '../form/Select'
import { generateResourceTopicOptions } from '../form/options'

export const ResourceTopicAutocomplete = ({ resourceTopics, setResourceTopics, placeholder }) => {
  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.resource.topic.label') })

  const selectResourceTopic = (resourceTopic) => {
    setResourceTopics([...resourceTopics.filter(({ value }) => value !== resourceTopic.value), resourceTopic])
  }

  const options = useMemo(() => generateResourceTopicOptions(format), [format])

  const loadOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  const toggleFilter = (event) => {
    event.preventDefault()
    setShowFilter(!showFilter)
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <a href='#' className='flex' onClick={toggleFilter}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.resource.topic.label')}
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
          aria-label={format('filter.byEntity', { entity: format('ui.resource.topic.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.resource.topic.label') })}
          onChange={selectResourceTopic}
          placeholder={controlPlaceholder}
          value=''
        />
      }
    </div>
  )
}

export const ResourceTopicActiveFilters = ({ resourceTopics, setResourceTopics }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeResourceTopic = (resourceTopicSlug) => {
    setResourceTopics(resourceTopics =>
      [...resourceTopics.filter(resourceTopic => resourceTopic.slug !== resourceTopicSlug)]
    )
  }

  return (
    <>
      {resourceTopics?.map((resourceTopic, resourceTopicIndex) => (
        <div key={resourceTopicIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {resourceTopic.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.resource.topic.label')})
              </div>
            </div>
            <button onClick={() => removeResourceTopic(resourceTopic.slug)}>
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
