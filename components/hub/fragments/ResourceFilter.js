import { useIntl } from 'react-intl'
import { useCallback, useContext } from 'react'
import { ResourceTypeActiveFilters, ResourceTypeAutocomplete } from '../../shared/filter/ResourceType'
import { ResourceFilterContext, ResourceFilterDispatchContext } from '../../context/ResourceFilterContext'
import { ResourceTopicActiveFilters, ResourceTopicAutocomplete } from '../../shared/filter/ResourceTopic'
import { CountryActiveFilters, CountryAutocomplete } from '../../shared/filter/Country'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'
import { COUNTRIES_WITH_RESOURCES_SEARCH_QUERY } from '../../shared/query/country'

const ResourceFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    resourceTags,
    resourceTypes,
    resourceTopics,
    resourceCountries
  } = useContext(ResourceFilterContext)

  const {
    setResourceTags,
    setResourceTypes,
    setResourceTopics,
    setResourceCountries
  } = useContext(ResourceFilterDispatchContext)

  const clearFilter = (e) => {
    e.preventDefault()
    setResourceTags([])
    setResourceTypes([])
    setResourceTopics([])
    setResourceCountries([])
  }

  const filteringWorkflow = () => {
    let count = 0
    count = count + resourceTags.length
    count = count + resourceTypes.length
    count = count + resourceTopics.length
    count = count + resourceCountries.length

    return count > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringWorkflow() &&
        <div className='flex flex-col gap-y-3'>
          <div className='flex'>
            <div className='text-sm font-semibold text-dial-sapphire'>
              {format('ui.filter.filteredBy')}:
            </div>
            <div className='ml-auto text-sm text-dial-stratos'>
              <button type='button' onClick={clearFilter}>
                <span className='text-dial-sapphire'>
                  {format('ui.filter.clearAll')}
                </span>
              </button>
            </div>
          </div>
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            <ResourceTypeActiveFilters
              resourceTypes={resourceTypes}
              setResourceTypes={setResourceTypes}
            />
            <ResourceTopicActiveFilters
              resourceTopics={resourceTopics}
              setResourceTopics={setResourceTopics}
            />
            <CountryActiveFilters
              countries={resourceCountries}
              setCountries={setResourceCountries}
            />
            <TagActiveFilters
              tags={resourceTags}
              setTags={setResourceTags}
            />
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}:
        </div>
        <hr className='border-b border-dial-slate-200'/>
        <ResourceTypeAutocomplete
          resourceTypes={resourceTypes}
          setResourceTypes={setResourceTypes}
        />
        <hr className='border-b border-dial-slate-200'/>
        <ResourceTopicAutocomplete
          resourceTopics={resourceTopics}
          setResourceTopics={setResourceTopics}
        />
        <hr className='border-b border-dial-slate-200'/>
        <CountryAutocomplete
          searchQuery={COUNTRIES_WITH_RESOURCES_SEARCH_QUERY}
          countries={resourceCountries}
          setCountries={setResourceCountries}
        />
        <hr className='border-b border-dial-slate-200'/>
        <TagAutocomplete
          tags={resourceTags}
          setTags={setResourceTags}
        />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default ResourceFilter
