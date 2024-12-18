import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { handleLoadingQuery, handleQueryError } from '../../shared/GraphQueryHandler'
import { RESOURCE_TOPIC_SEARCH_QUERY } from '../../shared/query/resourceTopic'
import HubResourceTiles from '../fragments/HubResourceTile'

const HubResources = ({  pageNumber, showWithTopicOnly, onClickHandler }) => {

  const { loading, error, data } = useQuery(RESOURCE_TOPIC_SEARCH_QUERY, {
    variables: { search: '' },
    skip: !showWithTopicOnly,
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
  }

  const { resourceTopics } = data ?? { resourceTopics: [] }

  return (
    <HubResourceTiles
      pageNumber={pageNumber}
      onClickHandler={onClickHandler}
      resourceTopics={resourceTopics}
    />
  )
}

export default HubResources
