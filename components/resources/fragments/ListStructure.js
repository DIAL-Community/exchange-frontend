import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { ResourceFilterContext } from '../../context/ResourceFilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PAGINATED_RESOURCES_QUERY } from '../../shared/query/resource'
import { DisplayType } from '../../utils/constants'
import ResourceCard from './ResourceCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search, resourceTypes, resourceTopics, resourceTags, resourceCountries } = useContext(ResourceFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_RESOURCES_QUERY, {
    variables: {
      search,
      tags: resourceTags.map(r => r.label),
      countries: resourceCountries.map(r => r.value),
      resourceTypes: resourceTypes.map(r => r.label),
      resourceTopics: resourceTopics.map(r => r.label),
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedResources) {
    return <NotFound />
  }

  const { paginatedResources: resources } = data

  return (
    <div className='flex flex-col gap-3'>
      {resources.map((resource, index) =>
        <div key={index}>
          <ResourceCard
            index={index}
            resource={resource}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
