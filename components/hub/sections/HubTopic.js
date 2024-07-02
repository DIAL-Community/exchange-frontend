import parse from 'html-react-parser'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { RESOURCE_TOPIC_DETAIL_QUERY } from '../../shared/query/resourceTopic'
import HubTopicDetail from '../fragments/HubTopicDetail'
import HubBreadcrumb from './HubBreadcrumb'

const HubTopic = ({ slug }) => {
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
    <div className='flex flex-col gap-6'>
      <img className='h-80 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/hub-hero.svg'/>
      <div className='absolute w-full left-1/2 -translate-x-1/2 min-h-[20rem]' style={{ top: 'var(--ui-header-height)' }}>
        <div className='max-w-catalog mx-auto'>
          <div className='px-4 lg:px-8 xl:px-56 text-dial-gray'>
            <HubBreadcrumb slugNameMapping={slugNameMapping} />
          </div>
        </div>
        <div className='text-2xl text-center text-dial-cotton py-5 uppercase mx-auto max-w-prose'>
          {resourceTopic.name}
        </div>
        <div className='text-lg text-center text-dial-cotton pb-8 mx-auto max-w-prose'>
          {resourceTopic.resourceTopicDescription && parse(resourceTopic.resourceTopicDescription?.description)}
        </div>
      </div>
      <div className='px-4 lg:px-8 xl:px-56 min-h-[70vh] py-8'>
        <HubTopicDetail resourceTopic={resourceTopic} />
      </div>
    </div>
  )
}

export default HubTopic
