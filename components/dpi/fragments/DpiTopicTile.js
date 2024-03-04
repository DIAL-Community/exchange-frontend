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
    <div className='grid grid-cols-3 gap-3'>
      {resourceTopics.map((resourceTopic, index) =>
        <Link key={index} href={`/dpi-topics/${resourceTopic.slug}`}>
          <div className='bg-dial-stratos text-white'>
            <div className='py-16 px-8'>
              {resourceTopic.name}
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

export default DpiTopicTile
