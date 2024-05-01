import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { ResourceFilterContext } from '../../context/ResourceFilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { RESOURCE_TOPIC_RESOURCES_QUERY } from '../../shared/query/resourceTopic'
import DpiResourceTile from '../fragments/DpiResourceTile'

const DpiResources = () => {

  const { search, resourceTypes, resourceCountries } = useContext(ResourceFilterContext)

  const { loading, error, data } = useQuery(RESOURCE_TOPIC_RESOURCES_QUERY, {
    variables: {
      slug: '',
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
    <DpiResourceTile resources={resourceTopicResources} />
  )
}

export default DpiResources
