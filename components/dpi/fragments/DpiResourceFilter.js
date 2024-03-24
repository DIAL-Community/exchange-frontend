import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { ResourceFilterContext, ResourceFilterDispatchContext } from '../../context/ResourceFilterContext'
import ResourceSearchBar from '../../resources/fragments/ResourceSearchBar'
import { CountryActiveFilters, CountryAutocomplete } from '../../shared/filter/Country'
import { ResourceTypeActiveFilters, ResourceTypeAutocomplete } from '../../shared/filter/ResourceType'
import { COUNTRIES_WITH_RESOURCES_SEARCH_QUERY } from '../../shared/query/country'

const DpiResourceFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    resourceTypes,
    resourceTopics,
    resourceCountries
  } = useContext(ResourceFilterContext)

  const {
    setResourceTypes,
    setResourceTopics,
    setResourceCountries
  } = useContext(ResourceFilterDispatchContext)

  const clearFilter = (e) => {
    e.preventDefault()
    setResourceTypes([])
    setResourceTopics([])
    setResourceCountries([])
  }

  const filteringWorkflow = () => {
    let count = 0
    count = count + resourceTypes.length
    count = count + resourceTopics.length
    count = count + resourceCountries.length

    return count > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringWorkflow() &&
      <div className='grid grid-cols-3'>
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
            <CountryActiveFilters
              countries={resourceCountries}
              setCountries={setResourceCountries}
            />
          </div>
        </div>
      </div>
      }
      <div className='grid grid-cols-3'>
        <div className='flex flex-col gap-y-2'>
          <div className='text-sm font-semibold text-dial-sapphire'>
            {format('ui.filter.primary.title')}:
          </div>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        <div className='py-3'>
          <ResourceTypeAutocomplete
            resourceTypes={resourceTypes}
            setResourceTypes={setResourceTypes}
            inline={true}
          />
        </div>
        <div className='py-3'>
          <CountryAutocomplete
            searchQuery={COUNTRIES_WITH_RESOURCES_SEARCH_QUERY}
            countries={resourceCountries}
            setCountries={setResourceCountries}
            inline={true}
          />
        </div>
        <div>
          <ResourceSearchBar />
        </div>
      </div>
    </div>
  )
}

export default DpiResourceFilter
