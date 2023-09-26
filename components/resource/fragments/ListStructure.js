import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_RESOURCES_QUERY } from '../../shared/query/resource'
import { FilterContext } from '../../context/FilterContext'
import ResourceCard from '../ResourceCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_RESOURCES_QUERY, {
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
