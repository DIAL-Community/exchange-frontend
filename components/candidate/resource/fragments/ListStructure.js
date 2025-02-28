import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { ResourceFilterContext } from '../../../context/ResourceFilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
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
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.paginatedCandidateResources) {
    return handleMissingData()
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
