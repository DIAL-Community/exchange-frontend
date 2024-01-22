import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_DATASETS_QUERY } from '../../shared/query/dataset'
import { DatasetFilterContext } from '../../context/DatasetFilterContext'
import DatasetCard from '../DatasetCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(DatasetFilterContext)

  const { sectors, sdgs, tags, origins, datasetTypes, countries } = useContext(DatasetFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_DATASETS_QUERY, {
    variables: {
      search,
      origins: origins.map(origin => origin.value),
      sdgs: sdgs.map(sdg => sdg.value),
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
      datasetTypes: datasetTypes.map(datasetType => datasetType.value),
      countries: countries.map(country => country.value),
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedDatasets) {
    return <NotFound />
  }

  const { paginatedDatasets: datasets } = data

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
