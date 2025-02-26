import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/resource'
import HubPagination from './HubPagination'

export const NATIONAL_WEBSITE = 'National Website'
const DEFAULT_PAGE_SIZE = 6

const WebsiteCard = ({ resource, country }) => {
  const displayLargeCard = () =>
    <div className='border bg-dial-yellow rounded-md min-h-[2rem]'>
      <div className='flex flex-col'>
        <Link
          href={`/hub/countries/${country.slug}/resources/${resource.slug}`}
          className='p-3 text-lg font-medium flex group'
        >
          <div className='line-clamp-1 border-b border-transparent group-hover:border-dial-stratos'>
            {resource.name}
          </div>
        </Link>
        <a
          target='_blank'
          rel='noreferrer'
          href={`//${resource.resourceLink}`}
          className='px-3 pb-3 text-justify text-sm flex group'
        >
          <div className='line-clamp-1 border-b border-transparent group-hover:border-dial-stratos'>
            {resource.resourceLink}&nbsp;⧉
          </div>
        </a>
      </div>
    </div>

  return (
    displayLargeCard()
  )
}

const WebsitePagination = ({ country, pageNumber, onClickHandler, theme='light' }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(RESOURCE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search: '',
      resourceTypes: [NATIONAL_WEBSITE],
      countries: [country.id]
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

const WebsiteList = ({ country, pageNumber }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PAGINATED_RESOURCES_QUERY, {
    variables: {
      search: '',
      countries: [country.id],
      resourceTypes: [NATIONAL_WEBSITE],
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
    <div className='grid md:grid-cols-2 gap-4'>
      {resources.map((resource, index) =>
        <WebsiteCard key={index} resource={resource} country={country} />
      )}
    </div>
  )
}

const HubCountryWebsites = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
  }, [])

  return (
    <div className='website-section'>
      <div className='px-4 lg:px-8 xl:px-24 3xl:px-56 text-dial-stratos flex flex-col'>
        <div className='text-xl font-medium py-6'>
          {format('hub.country.websites')}
        </div>
        <WebsiteList country={country} pageNumber={pageNumber} />
        <WebsitePagination
          country={country}
          pageNumber={pageNumber}
          onClickHandler={onClickHandler}
          theme={'dark'}
        />
      </div>
    </div>
  )
}

export default HubCountryWebsites
