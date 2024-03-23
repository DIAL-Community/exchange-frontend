import { useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import { useQuery } from '@apollo/client'
import { ResourceFilterContext } from '../../context/ResourceFilterContext'
import ResourceCard from '../../resources/fragments/ResourceCard'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { RESOURCE_TOPIC_RESOURCES_QUERY } from '../../shared/query/resourceTopic'
import { DisplayType } from '../../utils/constants'
import DpiResourceFilter from './DpiResourceFilter'

const DpiTopicDetail = ({ resourceTopic }) => {
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
      <div className='h3 text-center'>
        <FormattedMessage
          id='dpi.topic.reports'
          values={{
            break: () => <br />
          }}
        />
      </div>
      <DpiResourceFilter />
      <div className='grid grid-cols-3 gap-8'>
        {resourceTopicResources.map((resource, index) =>
          <ResourceCard key={index} resource={resource} displayType={DisplayType.DPI_CARD}  />
        )}
      </div>
    </div>
  )
}

export default DpiTopicDetail
