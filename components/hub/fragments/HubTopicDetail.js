import { useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import { useQuery } from '@apollo/client'
import { ResourceFilterContext } from '../../context/ResourceFilterContext'
import ResourceCard from '../../resources/fragments/ResourceCard'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { RESOURCE_TOPIC_RESOURCES_QUERY } from '../../shared/query/resourceTopic'
import { DisplayType } from '../../utils/constants'
import HubResourceFilter from './HubResourceFilter'

const HubTopicDetail = ({ resourceTopic }) => {
  const { search, resourceTypes, resourceCountries } = useContext(ResourceFilterContext)

  const { loading, error, data } = useQuery(RESOURCE_TOPIC_RESOURCES_QUERY, {
    variables: {
      slug: resourceTopic.slug,
      search,
      countries: resourceCountries.map(r => r.label),
      resourceTypes: resourceTypes.map(r => r.value)
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.resourceTopicResources) {
    return <NotFound />
  }

  const { resourceTopicResources } = data

  return (
    <div className='flex flex-col gap-5'>
      <div className='text-lg text-center'>
        <FormattedMessage
          id='hub.topic.reports'
          values={{
            break: () => <br />
          }}
        />
      </div>
      <HubResourceFilter />
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
        {resourceTopicResources.map((resource, index) =>
          <ResourceCard key={index} resource={resource} displayType={DisplayType.HUB_CARD}  />
        )}
      </div>
    </div>
  )
}

export default HubTopicDetail
