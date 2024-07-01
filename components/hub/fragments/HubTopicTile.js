import { useContext } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { RESOURCE_TOPIC_SEARCH_QUERY } from '../../shared/query/resourceTopic'

const HubTopicTile = () => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(RESOURCE_TOPIC_SEARCH_QUERY, {
    variables: {
      search
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.resourceTopics) {
    return <NotFound />
  }

  const { resourceTopics } = data

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-12 max-w-xl 2xl:max-w-2xl mx-auto'>
      {resourceTopics.map((resourceTopic, index) =>
        <Link key={index} href={`/hub/topics/${resourceTopic.slug}`} className='text-dial-cotton'>
          <div className='bg-dial-deep-purple py-16 md:py-24 aspect-square relative flex justify-center'>
            <img
              className='white-filter opacity-40'
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
