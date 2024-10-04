import { useQuery } from '@apollo/client'
import { useContext } from 'react'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
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
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedUseCases) {
    return <NotFound />
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
