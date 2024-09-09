import { useQuery } from '@apollo/client'
import { Error, Loading } from '../../shared/FetchStatus'
import { RESOURCE_TOPIC_SEARCH_QUERY } from '../../shared/query/resourceTopic'
import HubResourceTiles from '../fragments/HubResourceTile'

const HubResources = ({  pageNumber, showWithTopicOnly, onClickHandler }) => {

  const { loading, error, data } = useQuery(RESOURCE_TOPIC_SEARCH_QUERY, {
    variables: { search: '' },
    skip: !showWithTopicOnly
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
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
