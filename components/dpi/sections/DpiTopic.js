import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { RESOURCE_TOPIC_DETAIL_QUERY } from '../../shared/query/resourceTopic'
import DpiTopicDetail from '../fragments/DpiTopicDetail'
import DpiBreadcrumb from './DpiBreadcrumb'

const DpiTopic = ({ slug }) => {
  const { loading, error, data } = useQuery(RESOURCE_TOPIC_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.resourceTopic) {
    return <NotFound />
  }

  const { resourceTopic } = data

  const slugNameMapping = (() => {
    const map = {}
    map[resourceTopic.slug] = resourceTopic.name

    return map
  })()

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[70vh] py-8'>
      <div className='flex flex-col gap-6'>
        <DpiBreadcrumb slugNameMapping={slugNameMapping} />
        <DpiTopicDetail resourceTopic={resourceTopic} />
      </div>
    </div>
  )
}

export default DpiTopic
