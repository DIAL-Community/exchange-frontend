import { useContext } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { RESOURCE_TOPIC_SEARCH_QUERY } from '../../shared/query/resourceTopic'

const DpiTopicTile = () => {
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
    <div className='grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto'>
      {resourceTopics.map((resourceTopic, index) =>
        <Link key={index} href={`/dpi-topics/${resourceTopic.slug}`}>
          <div className='bg-dial-deep-purple text-dial-cotton py-16 aspect-square relative flex justify-center'>
            <img className='h-full' alt={resourceTopic.name}
              src={`/images/dpi/${resourceTopic.slug.split('-')[0]}.png`}/>
            <div className='absolute left-1/2 -translate-x-1/2 bottom-20 uppercase px-8 py-2 text-lg'>
              {resourceTopic.name}
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

export default DpiTopicTile
