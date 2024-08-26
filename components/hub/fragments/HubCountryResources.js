import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import ResourceCard from '../../resources/fragments/ResourceCard'
import {
  PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY, RESOURCE_TYPE_SEARCH_QUERY
} from '../../shared/query/resource'
import { DisplayType } from '../../utils/constants'
import { GOVERNMENT_DOCUMENT } from './HubCountryPolicies'
import { NATIONAL_WEBSITE } from './HubCountryWebsites'
import HubPagination from './HubPagination'

const DEFAULT_PAGE_SIZE = 6

const ResourcePagination = ({ country, pageNumber, resourceTypes, onClickHandler, theme='light' }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(RESOURCE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search: '',
      countries: [country.id],
      resourceTypes: [...resourceTypes]
    }
  })

  if (loading) {
    return format('general.fetchingData')
  } else if (error) {
    return format('general.fetchError')
  } else if (!data?.paginationAttributeResource) {
    return format('app.notFound')
  }

  const { paginationAttributeResource: { totalCount } } = data

  return (
    <HubPagination
      pageNumber={pageNumber}
      totalCount={totalCount}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      onClickHandler={onClickHandler}
      theme={theme}
    />
  )
}

const ResourceList = ({ country, pageNumber, resourceTypes }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PAGINATED_RESOURCES_QUERY, {
    variables: {
      search: '',
      countries: [country.id],
      resourceTypes: [...resourceTypes],
      limit: DEFAULT_PAGE_SIZE,
      offset: pageNumber * DEFAULT_PAGE_SIZE
    }
  })

  if (loading) {
    return format('general.fetchingData')
  } else if (error) {
    return format('general.fetchError')
  } else if (!data?.paginatedResources) {
    return format('app.notFound')
  }

  const { paginatedResources: resources } = data

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
      {resources.map((resource, index) =>
        <ResourceCard key={index} resource={resource} displayType={DisplayType.HUB_CARD} />
      )}
    </div>
  )
}

const HubCountryResources = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)

  const { loading, error, data } = useQuery(RESOURCE_TYPE_SEARCH_QUERY, {
    variables: {
      search: ''
    }
  })

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
  }, [])

  if (loading) {
    return format('general.fetchingData')
  } else if (error) {
    return format('general.fetchError')
  } else if (!data?.resourceTypes) {
    return format('app.notFound')
  }

  const { resourceTypes } = data
  const otherResourceTypes = resourceTypes
    .filter(type => type.name !== GOVERNMENT_DOCUMENT && type.name !== NATIONAL_WEBSITE)
    .map(type => type.name)

  return (
    <div className='resource-section'>
      <div className='px-4 lg:px-8 xl:px-56 flex flex-col'>
        <div className='text-xl font-medium py-6'>
          {format('hub.topic.reports')}
        </div>
        <ResourceList
          country={country}
          pageNumber={pageNumber}
          resourceTypes={otherResourceTypes}
        />
        <ResourcePagination
          country={country}
          pageNumber={pageNumber}
          resourceTypes={otherResourceTypes}
          onClickHandler={onClickHandler}
          theme={'dark'}
        />
      </div>
    </div>
  )
}

export default HubCountryResources
