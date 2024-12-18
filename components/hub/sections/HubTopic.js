import parse from 'html-react-parser'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { RESOURCE_TOPIC_DETAIL_QUERY } from '../../shared/query/resourceTopic'
import HubTopicDetail from '../fragments/HubTopicDetail'
import HubBreadcrumb from './HubBreadcrumb'

const HubTopic = ({ slug, pageNumber, onClickHandler }) => {
  const { loading, error, data } = useQuery(RESOURCE_TOPIC_DETAIL_QUERY, {
    variables: { slug },
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
  } else if (!data?.resourceTopic) {
    return handleMissingData()
  }

  const { resourceTopic } = data

  const slugNameMapping = (() => {
    const map = {}
    map[resourceTopic.slug] = resourceTopic.name

    return map
  })()

  return (
    <div className='flex flex-col gap-6 pb-12 max-w-catalog mx-auto'>
      <img
        className='h-32 w-full object-cover'
        alt='DIAL Resource Hub - Resource Topic'
        src='/images/hero-image/hub-topic.svg'
      />
      <div className='absolute w-full left-1/2 -translate-x-1/2' style={{ top: 'var(--ui-header-height)' }}>
        <div className='max-w-catalog mx-auto py-2'>
          <div className='px-4 lg:px-8 xl:px-56 text-dial-gray'>
            <HubBreadcrumb slugNameMapping={slugNameMapping} />
          </div>
          <div className='px-4 lg:px-8 xl:px-56 py-8'>
            <div className='text-2xl text-dial-cotton uppercase max-w-prose'>
              {resourceTopic.name}
            </div>
          </div>
        </div>
      </div>
      <div className='px-4 lg:px-8 xl:px-56 min-h-[60vh] lg:min-h-[65vh]'>
        <div className='flex flex-col gap-y-6'>
          <div className='text-dial-stratos max-w-5xl text-justify'>
            {resourceTopic?.resourceTopicDescription && parse(resourceTopic.resourceTopicDescription?.description)}
          </div>
          <HubTopicDetail resourceTopic={resourceTopic} pageNumber={pageNumber} onClickHandler={onClickHandler} />
        </div>
      </div>
    </div>
  )
}

export default HubTopic
