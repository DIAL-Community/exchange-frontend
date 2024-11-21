import { useContext } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { RESOURCE_TOPIC_SEARCH_QUERY } from '../../shared/query/resourceTopic'

const HubTopicTile = () => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(RESOURCE_TOPIC_SEARCH_QUERY, {
    variables: { search },
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
  } else if (!data?.resourceTopics) {
    return handleMissingData()
  }

  const { resourceTopics } = data

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-12 mx-auto'>
      {resourceTopics.map((resourceTopic, index) =>
        <Link key={index} href={`/hub/topics/${resourceTopic.slug}`} className='text-dial-cotton'>
          <div className='bg-dial-deep-purple py-8 lg:py-12 w-52 h-56 relative flex justify-center'>
            <img
              className='white-filter opacity-50 mb-10 h-16'
              alt={resourceTopic.name}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + resourceTopic.imageFile}
            />
            <div className='absolute left-1/2 -translate-x-1/2 bottom-8 text-center uppercase 2xl:text-lg'>
              {resourceTopic.name}
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

export default HubTopicTile
