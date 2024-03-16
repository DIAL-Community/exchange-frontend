import { useContext } from 'react'
import parse from 'html-react-parser'
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
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-3xl mx-auto'>
      {resourceTopics.map((resourceTopic, index) =>
        <Link key={index} href={`/dpi-topics/${resourceTopic.slug}`}>
          <div className='bg-dial-sapphire text-white py-16 aspect-square'>
            <div className='px-8 py-2 text-xl font-bold'>
              {resourceTopic.name}
            </div>
            {resourceTopic.resourceTopicDescription &&
              <div className='px-8 text-sm font-italic'>
                {parse(resourceTopic.resourceTopicDescription?.description)}
              </div>
            }
          </div>
        </Link>
      )}
    </div>
  )
}

export default DpiTopicTile
