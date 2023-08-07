import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading } from '../../../../components/shared/FetchStatus'
import { PAGINATED_DATASETS_QUERY } from '../../shared/query/dataset'
import { DatasetFilterContext } from '../../../../components/context/DatasetFilterContext'
import DatasetCard from '../DatasetCard'
import { DisplayType } from '../../utils/constants'
import { NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(DatasetFilterContext)

  const { sectors } = useContext(DatasetFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_DATASETS_QUERY, {
    variables: {
      search,
      sectors: sectors.map(sector => sector.value),
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedDatasetsRedux) {
    return <NotFound />
  }

  const { paginatedDatasetsRedux: datasets } = data

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
