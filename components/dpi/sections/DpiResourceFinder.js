import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import ResourceCard from '../../resources/fragments/ResourceCard'
import { ResourceFilterContext } from '../../context/ResourceFilterContext'
import { RESOURCE_TOPIC_RESOURCES_QUERY } from '../../shared/query/resourceTopic'
import { DisplayType } from '../../utils/constants'
import DpiResourceFilter from '../fragments/DpiResourceFilter'

const DpiResourceFinder = () => {

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
    <>
      <div className='px-4 lg:px-8 xl:px-56 min-h-[70vh] py-8'>
        <DpiResourceFilter />
        <div className='grid grid-cols-3 gap-3'>
          {resourceTopicResources.map((resource, index) => {
            return (
              <div className='line-clamp-2 overflow-auto' key={index}>
                <ResourceCard key={index} resource={resource} displayType={DisplayType.DPI_CARD}  />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default DpiResourceFinder
