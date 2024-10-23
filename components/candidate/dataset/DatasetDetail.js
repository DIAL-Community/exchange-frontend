import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { CANDIDATE_DATASET_DETAIL_QUERY } from '../../shared/query/candidateDataset'
import DatasetDetailLeft from './DatasetDetailLeft'
import DatasetDetailRight from './DatasetDetailRight'

const DatasetDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(CANDIDATE_DATASET_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.candidateDataset) {
    return handleMissingData()
  }

  const { candidateDataset: dataset } = data

  const slugNameMapping = (() => {
    const map = {}
    map[dataset.slug] = dataset.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <DatasetDetailLeft dataset={dataset} scrollRef={scrollRef} />
        </div>
        <div className='lg:basis-2/3'>
          <DatasetDetailRight ref={scrollRef} dataset={dataset} />
        </div>
      </div>
    </div>
  )
}

export default DatasetDetail
