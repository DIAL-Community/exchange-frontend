import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_CANDIDATE_DATASETS_QUERY } from '../../../shared/query/candidateDataset'
import DatasetCard from '../DatasetCard'
import { DisplayType } from '../../../utils/constants'
import { FilterContext } from '../../../../../components/context/FilterContext'
import { Error, Loading, NotFound } from '../../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_CANDIDATE_DATASETS_QUERY, {
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
  } else if (!data?.paginatedCandidateDatasets) {
    return <NotFound />
  }

  const { paginatedCandidateDatasets: datasets } = data

  return (
    <div className='flex flex-col gap-3'>
      {datasets.map((dataset, index) =>
        <div key={index}>
          <DatasetCard
            index={index}
            dataset={dataset}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
