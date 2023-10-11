import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { DisplayType } from '../../utils/constants'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { CUSTOM_PAGINATED_RESOURCES_QUERY } from '../../shared/query/resource'
import ResourceCard from './ResourceCard'
import ResourceListLeft from './ResourceListLeft'

const ResourceListMain = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(CUSTOM_PAGINATED_RESOURCES_QUERY, {
    variables: {
      search,
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
        <div className='grid grid-cols-3 gap-x-4 -mx-6'>
          {featuredResources.map((resource, index) =>
            <ResourceCard
              key={index}
              index={index}
              resource={resource}
              displayType={DisplayType.FEATURED_CARD}
            />
          )}
        </div>
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
