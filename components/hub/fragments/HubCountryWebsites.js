import { useCallback, useState } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/resource'
import HubPagination from './HubPagination'

const DEFAULT_PAGE_SIZE = 6

const WebsiteCard = ({ resource }) => {
  const displayLargeCard = () =>
    <div className='rounded-lg min-h-[10rem]'>
      <div className='flex flex-col gap-y-3'>
        <div className='text-lg font-semibold'>
          {resource.name}
        </div>
        <div className='line-clamp-4 text-justify'>
          {resource.parsedDescription && parse(resource.parsedDescription)}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/hub/resources/${resource.slug}`}>
        {displayLargeCard()}
      </Link>
    </div>
  )
}

const WebsitePagination = ({ search, country, pageNumber, onClickHandler, theme='light' }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(RESOURCE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      resourceTypes: ['National Website'],
      countries: [country.name]
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
      countries: [country.name],
      resourceTypes: ['National Website'],
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
    <div className='flex flex-col gap-2'>
      {resources.map((resource, index) =>
        <div className='flex flex-col gap-y-4' key={index}>
          <hr className='border-b border-gray-300 border-dashed' />
          <WebsiteCard key={index} resource={resource} />
        </div>
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
      <div className='px-4 lg:px-8 xl:px-56 text-dial-stratos'>
        <div className='text-2xl py-8'>
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
