import { useContext, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { ResourceFilterContext } from '../../context/ResourceFilterContext'
import { FilterContext } from '../../context/FilterContext'
import { CUSTOM_PAGINATED_RESOURCES_QUERY } from '../../shared/query/resource'
import ResourceCard from './ResourceCard'
import ResourceListLeft from './ResourceListLeft'
import ResourceSearchBar from './ResourceSearchBar'

const ResourceListMain = ({ pageOffset, defaultPageSize }) => {
  const { resourceTypes, resourceTopics } = useContext(ResourceFilterContext)
  const { search } = useContext(FilterContext)

  const topRef = useRef(null)

  const { loading, error, data } = useQuery(CUSTOM_PAGINATED_RESOURCES_QUERY, {
    variables: {
      search,
      resourceTypes: resourceTypes.map(r => r.value),
      resourceTopics: resourceTopics.map(r => r.value),
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedResources && !data?.spotlightResources && !data?.featuredResources) {
    return <NotFound />
  }

  const { featuredResources, spotlightResources, paginatedResources } = data

  return (
    <div className='flex flex-col gap-y-12'>
      <div className='flex flex-col gap-8'>
        {spotlightResources.map((resource, index) =>
          <ResourceCard
            key={index}
            index={index}
            resource={resource}
            displayType={DisplayType.SPOTLIGHT_CARD}
          />
        )}
        <div className='grid lg:grid-cols-3 gap-x-4 -mx-6'>
          {featuredResources.map((resource, index) =>
            <ResourceCard
              key={index}
              index={index}
              resource={resource}
              displayType={DisplayType.FEATURED_CARD}
            />
          )}
        </div>
        <ResourceSearchBar ref={topRef} />
        <div className='flex flex-col lg:flex-row gap-x-8'>
          <div className='lg:basis-1/3'>
            <ResourceListLeft />
          </div>
          <div className='lg:basis-2/3'>
            <div className='grid grid-cols-1 gap-3'>
              {paginatedResources.map((resource, index) =>
                <ResourceCard
                  key={index}
                  index={index}
                  resource={resource}
                  displayType={DisplayType.LARGE_CARD}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceListMain
