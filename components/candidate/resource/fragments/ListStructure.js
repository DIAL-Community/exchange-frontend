import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { ResourceFilterContext } from '../../../context/ResourceFilterContext'
import { Error, Loading, NotFound } from '../../../shared/FetchStatus'
import { PAGINATED_CANDIDATE_RESOURCES_QUERY } from '../../../shared/query/candidateResource'
import { DisplayType } from '../../../utils/constants'
import ResourceCard from '../ResourceCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(ResourceFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_CANDIDATE_RESOURCES_QUERY, {
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
  } else if (!data?.paginatedCandidateResources) {
    return <NotFound />
  }

  const { paginatedCandidateResources: candidateResources } = data

  return (
    <div className='flex flex-col gap-3'>
      {candidateResources.map((candidateResource, index) =>
        <div key={index}>
          <ResourceCard
            index={index}
            candidateResource={candidateResource}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
