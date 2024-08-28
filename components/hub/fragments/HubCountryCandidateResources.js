import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import parse from 'html-react-parser'
import { FiPlusCircle } from 'react-icons/fi'
import Link from 'next/link'
import { DisplayType } from '../../utils/constants'
import {
  CANDIDATE_RESOURCE_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_CANDIDATE_RESOURCES_QUERY
} from '../../shared/query/candidateResource'
import HubPagination from './HubPagination'

const DEFAULT_PAGE_SIZE = 6

const ResourceCard = ({ displayType, resource }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayHubCard = () =>
    <div className='rounded-lg min-h-[6rem] group'>
      <div className='flex flex-col gap-y-3 relative'>
        <div className='text-lg font-medium flex'>
          <span className='border-b border-transparent group-hover:border-dial-cotton'>
            {resource.name}
          </span>
        </div>
        <div className='absolute top-2 right-2 bg-dial-cotton rounded'>
          <div className='text-dial-stratos text-xs px-2 py-1'>
            {format('candidate.inReview')}
          </div>
        </div>
        <div className='line-clamp-2 text-justify text-sm'>
          {resource.parsedDescription && parse(resource.parsedDescription)}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      {displayType === DisplayType.HUB_CARD && displayHubCard()}
    </div>
  )
}

const ResourcePagination = ({ country, pageNumber, onClickHandler, theme='light' }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(CANDIDATE_RESOURCE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search: '',
      countries: [country.id],
      inReviewOnly: true
    }
  })

  if (loading) {
    return format('general.fetchingData')
  } else if (error) {
    return format('general.fetchError')
  } else if (!data?.paginationAttributeCandidateResource) {
    return format('app.notFound')
  }

  const { paginationAttributeCandidateResource: { totalCount } } = data

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

const ResourceList = ({ country, pageNumber }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PAGINATED_CANDIDATE_RESOURCES_QUERY, {
    variables: {
      search: '',
      countries: [country.id],
      inReviewOnly: true,
      limit: DEFAULT_PAGE_SIZE,
      offset: pageNumber * DEFAULT_PAGE_SIZE
    }
  })

  if (loading) {
    return format('general.fetchingData')
  } else if (error) {
    return format('general.fetchError')
  } else if (!data?.paginatedCandidateResources) {
    return format('app.notFound')
  }

  const { paginatedCandidateResources: candidateResources } = data

  return (
    <div className='flex flex-col gap-2'>
      {candidateResources.map((candidateResource, index) =>
        <div key={index} className='flex flex-col gap-y-4'>
          <hr className='border-b border-gray-300 border-dashed' />
          <ResourceCard resource={candidateResource} displayType={DisplayType.HUB_CARD} />
        </div>
      )}
    </div>
  )
}

const HubCountryCandidateResources = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
  }, [])

  return (
    <div className='candidate-resource-section bg-dial-sapphire'>
      <div className='px-4 lg:px-8 xl:px-56 flex flex-col text-dial-cotton'>
        <div className='flex flex-col md:flex-row gap-3'>
          <div className='text-xl font-medium py-6'>
            {format('hub.country.candidateResources')}
          </div>
          <div className='ml-auto text-sm flex justify-center items-center'>
            <Link
              href={'/hub/resources/suggest'}
              className='cursor-pointer bg-white px-4 py-2 rounded text-dial-stratos'
            >
              <div className='flex flex-row gap-1'>
                <FiPlusCircle className='inline my-auto' />
                {format('app.createNew')}
              </div>
            </Link>
          </div>
        </div>
        <ResourceList
          country={country}
          pageNumber={pageNumber}
        />
        <ResourcePagination
          country={country}
          pageNumber={pageNumber}
          onClickHandler={onClickHandler}
          theme={'light'}
        />
      </div>
    </div>
  )
}

export default HubCountryCandidateResources
