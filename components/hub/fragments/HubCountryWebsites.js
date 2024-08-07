import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/resource'
import HubPagination from './HubPagination'

const DEFAULT_PAGE_SIZE = 6

const WebsiteCard = ({ resource }) => {
  const displayLargeCard = () =>
    <div className='border bg-dial-yellow rounded-md min-h-[2rem]'>
      <div className='p-3 flex flex-col gap-y-1'>
        <div className='text-lg font-semibold'>
          <Link href={`/hub/resources/${resource.slug}`}>
            {resource.name}
          </Link>
        </div>
        <div className='line-clamp-4 text-justify text-sm'>
          <a
            target='_blank'
            rel='noreferrer'
            href={`//${resource.resourceLink}`}
            className='line-clamp-1'
          >
            {resource.resourceLink}&nbsp;⧉
          </a>
        </div>
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
      resourceTypes: ['National Website'],
      countries: [country.id]
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
    <div className='grid md:grid-cols-2 gap-4'>
      {resources.map((resource, index) =>
        <WebsiteCard key={index} resource={resource} />
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
      <div className='px-4 lg:px-8 xl:px-56 text-dial-stratos flex flex-col'>
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
