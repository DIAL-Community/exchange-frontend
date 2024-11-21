import { useCallback, useState } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import {
  PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY, RESOURCE_TYPE_SEARCH_QUERY
} from '../../shared/query/resource'
import { GOVERNMENT_DOCUMENT } from './HubCountryPolicies'
import { NATIONAL_WEBSITE } from './HubCountryWebsites'
import HubPagination from './HubPagination'

const DEFAULT_PAGE_SIZE = 6

const ResourceCard = ({ resource, country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayHubCard = () =>
    <div className='rounded-lg min-h-[6rem]'>
      <div className='min-w-80 pb-4 mx-auto flex flex-col gap-3'>
        <div className='w-full flex justify-center items-center'>
          {resource.imageFile.indexOf('placeholder.svg') >= 0 &&
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.resource.label') })}
              className='aspect-auto h-[267px]'
            />
          }
          {resource.imageFile.indexOf('placeholder.svg') < 0 &&
            <div className='w-full h-full border border-dashed border-slate-300 flex justify-center items-center'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resource.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.resource.label') })}
                className='h-24 m-auto'
              />
            </div>
          }
        </div>
        <div className='text-lg font-semibold text-dial-stratos'>
          {resource.name}
        </div>
        <div className='line-clamp-4 text-dial-stratos text-sm'>
          {resource?.parsedDescription && parse(resource?.parsedDescription)}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/hub/countries/${country.slug}/resources/${resource.slug}`}>
        {displayHubCard()}
      </Link>
    </div>
  )
}

const ResourcePagination = ({ country, pageNumber, resourceTypes, onClickHandler, theme='light' }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(RESOURCE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search: '',
      countries: [country.id],
      resourceTypes: [...resourceTypes]
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
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
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
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
        <ResourceCard key={index} resource={resource} country={country} />
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
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
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
          {format('hub.country.resources')}
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
