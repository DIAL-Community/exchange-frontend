import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_CANDIDATE_ORGANIZATIONS_QUERY } from '../../../shared/query/candidateOrganization'
import OrganizationCard from '../OrganizationCard'
import { DisplayType } from '../../../utils/constants'
import { OrganizationFilterContext } from '../../../context/OrganizationFilterContext'
import { Error, Loading, NotFound } from '../../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(OrganizationFilterContext)
  const { loading, error, data } = useQuery(PAGINATED_CANDIDATE_ORGANIZATIONS_QUERY, {
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
  } else if (!data?.paginatedCandidateOrganizations) {
    return <NotFound />
  }

  const { paginatedCandidateOrganizations: organizations } = data

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
