import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_USE_CASES_QUERY } from '../../shared/query/useCase'
import { DisplayType } from '../../utils/constants'
import UseCaseCard from '../UseCaseCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { sdgs, showBeta, showGovStackOnly, search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_USE_CASES_QUERY, {
    variables: {
      search,
      sdgs: sdgs.map(sdg => sdg.value),
      showBeta,
      showGovStackOnly,
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
  } else if (!data?.paginatedUseCases) {
    return handleMissingData()
  }

  const { paginatedUseCases: useCases } = data

  return (
    <div className='flex flex-col gap-3'>
      {useCases.map((useCase, index) =>
        <div key={index}>
          <UseCaseCard
            index={index}
            useCase={useCase}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
