import { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading } from '../../../../components/shared/FetchStatus'
import { PAGINATED_USE_CASES_QUERY } from '../../shared/query/useCase'
import { UseCaseFilterContext } from '../../../../components/context/UseCaseFilterContext'
import UseCaseCard from '../UseCaseCard'
import { DisplayType } from '../../utils/constants'
import { FilterContext } from '../../../../components/context/FilterContext'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { setResultCounts } = useContext(FilterContext)
  const { sdgs, showBeta, govStackOnly, search } = useContext(UseCaseFilterContext)

  const { loading, error, data, fetchMore } = useQuery(PAGINATED_USE_CASES_QUERY, {
    variables: {
      search,
      sdgs: sdgs.map(sdg => sdg.value),
      showBeta,
      govStackOnly,
      limit: defaultPageSize,
      offset: pageOffset
    },
    onCompleted: (data) => {
      setResultCounts(resultCount => {
        return { ...resultCount, 'filter.entity.useCases': data.paginatedUseCases.length }
      })
    }
  })

  useEffect(() => {
    fetchMore({
      variables: {
        search,
        sdgs: sdgs.map(sdg => sdg.value),
        showBeta: true,
        govStackOnly,
        limit: defaultPageSize,
        offset: pageOffset
      }
    })
  }, [search, sdgs, showBeta, govStackOnly, pageOffset, defaultPageSize, fetchMore])

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
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
