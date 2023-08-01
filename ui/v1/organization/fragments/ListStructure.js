import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading } from '../../../../components/shared/FetchStatus'
import { PAGINATED_ORGANIZATIONS_QUERY } from '../../shared/query/organization'
import { OrganizationFilterContext } from '../../../../components/context/OrganizationFilterContext'
import OrganizationCard from '../OrganizationCard'
import { DisplayType } from '../../utils/constants'
import { FilterContext } from '../../../../components/context/FilterContext'
import { NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { setResultCounts } = useContext(FilterContext)
  const { search } = useContext(OrganizationFilterContext)

  const { sectors } = useContext(OrganizationFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_ORGANIZATIONS_QUERY, {
    variables: {
      search,
      sectors: sectors.map(sector => sector.value),
      limit: defaultPageSize,
      offset: pageOffset
    },
    onCompleted: (data) => {
      setResultCounts(resultCount => {
        return { ...resultCount, 'filter.entity.organizations': data.paginatedOrganizations.length }
      })
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
    <div className='flex flex-col gap-3'>
      {organizations.map((organization, index) =>
        <div key={index}>
          <OrganizationCard
            index={index}
            organization={organization}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
