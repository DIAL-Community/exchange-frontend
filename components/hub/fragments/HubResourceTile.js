import { useCallback, useContext } from 'react'
import Link from 'next/link'
import { FiPlusCircle } from 'react-icons/fi'
import { FormattedMessage, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ResourceFilterContext } from '../../context/ResourceFilterContext'
import ResourceCard from '../../resources/fragments/ResourceCard'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/resource'
import { DisplayType } from '../../utils/constants'
import HubPagination from './HubPagination'
import HubResourceFilter from './HubResourceFilter'

const DEFAULT_PAGE_SIZE = 6
const ResourceTilePagination = ({ pageNumber, onClickHandler, resourceTopics, theme='light' }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search, resourceTypes, resourceCountries } = useContext(ResourceFilterContext)
  const { loading, error, data } = useQuery(RESOURCE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      countries: resourceCountries.map(r => r.value),
      resourceTypes: resourceTypes.map(r => r.name),
      resourceTopics: resourceTopics.map(r => r.name)
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

const ResourceTiles = ({ pageNumber, resourceTopics }) => {
  const { search, resourceTypes, resourceCountries } = useContext(ResourceFilterContext)
  const { loading, error, data } = useQuery(PAGINATED_RESOURCES_QUERY, {
    variables: {
      search,
      countries: resourceCountries.map(r => r.value),
      resourceTypes: resourceTypes.map(r => r.name),
      resourceTopics: resourceTopics.map(r => r.name),
      limit: DEFAULT_PAGE_SIZE,
      offset: pageNumber * DEFAULT_PAGE_SIZE
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedResources) {
    return <NotFound />
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

const HubResourceTiles = ({ resourceTopics, pageNumber, onClickHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()

  const generateCreateResourceRoute = () => {
    return user.isAdminUser || user.isAdliAdminUser || user.isEditorUser
      ? '/hub/resources/create'
      : '/hub/resources/suggest'
  }

  const generateCreateResourceRouteLabel = () => {
    return user.isAdminUser || user.isAdliAdminUser || user.isEditorUser
      ? format('hub.country.createResource')
      : format('hub.country.suggestResource')
  }

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[70vh] py-6'>
      <HubResourceFilter />
      { user &&
        <div className='flex mb-6'>
          <div className='ml-auto text-sm flex'>
            <Link
              href={generateCreateResourceRoute()}
              className='cursor-pointer bg-dial-sapphire px-4 py-2 rounded '
            >
              <div className='flex flex-row gap-1 text-dial-cotton'>
                <FiPlusCircle className='inline my-auto' />
                <FormattedMessage id={generateCreateResourceRouteLabel()} />
              </div>
            </Link>
          </div>
        </div>
      }
      <ResourceTiles
        pageNumber={pageNumber}
        resourceTopics={resourceTopics}
      />
      <ResourceTilePagination
        pageNumber={pageNumber}
        onClickHandler={onClickHandler}
        resourceTopics={resourceTopics}
        theme={'dark'}
      />
    </div>
  )
}

export default HubResourceTiles
