import { useQuery } from '@apollo/client'
import parse from 'html-react-parser'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { RESOURCE_TOPIC_DETAIL_QUERY } from '../../shared/query/resourceTopic'
import DpiTopicDetail from '../fragments/DpiTopicDetail'
import DpiBreadcrumb from './DpiBreadcrumb'

const DpiTopic = ({ slug }) => {
  const { loading, error, data } = useQuery(RESOURCE_TOPIC_DETAIL_QUERY, {
    variables: {
      slug
    }
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
    <div className='flex flex-col gap-6 pb-12'>
      <img className='relative h-80' alt='DIAL DPI Resource Hub' src='/images/hero-image/dpi-hero.png'/>
      <div className='absolute w-full top-28 left-1/2 -translate-x-1/2 px-4 lg:px-8 xl:px-56 pt-6 min-h-[20rem]'>
        <DpiBreadcrumb slugNameMapping={slugNameMapping} />
        <div className='text-2xl text-center text-white py-5 uppercase mx-auto max-w-prose'>
          {resourceTopic.name}
        </div>
        <div className='text-lg text-center text-white pb-8 mx-auto max-w-prose'>
          {parse(resourceTopic.resourceTopicDescription?.description)}
        </div>
      </div>
      <div className='px-4 lg:px-8 xl:px-56 min-h-[70vh] py-8'>
        <div className='flex flex-col gap-6'>
          <DpiTopicDetail resourceTopic={resourceTopic} />
        </div>
      </div>
    </div>
  )
}

export default DpiTopic
