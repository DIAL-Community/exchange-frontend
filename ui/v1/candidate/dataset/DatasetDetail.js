import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { CANDIDATE_DATASET_DETAIL_QUERY } from '../../shared/query/candidateDataset'
import Breadcrumb from '../../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import DatasetDetailRight from './DatasetDetailRight'
import DatasetDetailLeft from './DatasetDetailLeft'

const DatasetDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const commentsSectionRef = useRef(null)

  const { loading, error, data } = useQuery(CANDIDATE_DATASET_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.candidateDataset) {
    return <NotFound />
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
          <DatasetDetailLeft scrollRef={scrollRef} dataset={dataset} />
        </div>
        <div className='lg:basis-2/3'>
          <DatasetDetailRight ref={scrollRef} commentsSectionRef={commentsSectionRef} dataset={dataset} />
        </div>
      </div>
    </div>
  )
}

export default DatasetDetail
