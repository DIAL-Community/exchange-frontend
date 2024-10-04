import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_ORGANIZATIONS_QUERY } from '../../../shared/query/organization'
import { FilterContext } from '../../../context/FilterContext'
import { DisplayType } from '../../../utils/constants'
import { Error, Loading, NotFound } from '../../../shared/FetchStatus'
import OrganizationCard from './OrganizationCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_ORGANIZATIONS_QUERY, {
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
  } else if (!data?.paginatedOrganizations) {
    return <NotFound />
  }

  const { paginatedOrganizations: organizations } = data

  return (
    <div className='px-4 lg:px-8 min-h-[40vh] py-8'>
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8'>
        {organizations.map((organization, index) =>
          <div key={index}>
            <OrganizationCard
              index={index}
              organization={organization}
              displayType={DisplayType.GRID_CARD}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ListStructure
