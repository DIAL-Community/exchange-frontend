import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_USE_CASES_QUERY } from '../../shared/query/useCase'
import { UseCaseFilterContext } from '../../../../components/context/UseCaseFilterContext'
import UseCaseCard from '../UseCaseCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { sdgs, showBeta, govStackOnly, search } = useContext(UseCaseFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_USE_CASES_QUERY, {
    variables: {
      search,
      sdgs: sdgs.map(sdg => sdg.value),
      showBeta,
      govStackOnly,
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
