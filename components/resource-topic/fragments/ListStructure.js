import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_RESOURCE_TOPICS_QUERY } from '../../shared/query/resourceTopic'
import { DisplayType } from '../../utils/constants'
import ResourceTopicCard from '../ResourceTopicCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_RESOURCE_TOPICS_QUERY, {
    variables: {
      search,
      limit: defaultPageSize,
      offset: pageOffset
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
  } else if (!data?.paginatedResourceTopics) {
    return handleMissingData()
  }

  const { paginatedResourceTopics: resourceTopics } = data

  return (
    <div className='flex flex-col gap-3'>
      {resourceTopics.map((resourceTopic, index) =>
        <div key={index}>
          <ResourceTopicCard
            index={index}
            resourceTopic={resourceTopic}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
