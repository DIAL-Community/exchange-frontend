import { useContext } from 'react'
import Link from 'next/link'
import parse from 'html-react-parser'
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
          <div className='bg-dial-stratos text-white py-16'>
            <div className='px-8 py-2 text-xl font-bold'>
              {resourceTopic.name}
            </div>
            <div className='px-8 text-sm font-italic'>
              {parse(resourceTopic.resourceTopicDescription?.description)}
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

export default DpiTopicTile
