import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_RESOURCE_TOPICS_QUERY } from '../../shared/query/resourceTopic'
import ResourceTopicCard from '../ResourceTopicCard'
import { DisplayType } from '../../utils/constants'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_RESOURCE_TOPICS_QUERY, {
    variables: {
      search,
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedResourceTopics) {
    return <NotFound />
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
