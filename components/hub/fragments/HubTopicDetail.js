import { useCallback, useContext } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ResourceFilterContext } from '../../context/ResourceFilterContext'
import ResourceCard from '../../resources/fragments/ResourceCard'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/resource'
import { DisplayType } from '../../utils/constants'
import HubPagination from './HubPagination'
import HubResourceFilter from './HubResourceFilter'

const DEFAULT_PAGE_SIZE = 6

const TopicResourcePagination = ({ pageNumber, onClickHandler, resourceTopic, theme='light' }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search, resourceTypes, resourceCountries } = useContext(ResourceFilterContext)
  const { loading, error, data } = useQuery(RESOURCE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      countries: resourceCountries.map(r => r.label),
      resourceTypes: resourceTypes.map(r => r.value),
      resourceTopics: [resourceTopic.name]
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

const TopicResources = ({ pageNumber, resourceTopic }) => {
  const { search, resourceTypes, resourceCountries } = useContext(ResourceFilterContext)
  const { loading, error, data } = useQuery(PAGINATED_RESOURCES_QUERY, {
    variables: {
      search,
      countries: resourceCountries.map(r => r.label),
      resourceTypes: resourceTypes.map(r => r.value),
      resourceTopics: [resourceTopic.name],
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
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.paginatedResources) {
    return handleMissingData()
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

const HubTopicDetail = ({ resourceTopic, pageNumber, onClickHandler }) => {
  return (
    <div className='flex flex-col gap-5'>
      <div className='text-lg text-center'>
        <FormattedMessage
          id='hub.topic.reports'
          values={{
            break: () => <br />
          }}
        />
      </div>
      <HubResourceFilter />
      <TopicResources
        pageNumber={pageNumber}
        resourceTopic={resourceTopic}
      />
      <TopicResourcePagination
        pageNumber={pageNumber}
        onClickHandler={onClickHandler}
        resourceTopic={resourceTopic}
        theme={'dark'}
      />
    </div>
  )
}

export default HubTopicDetail
