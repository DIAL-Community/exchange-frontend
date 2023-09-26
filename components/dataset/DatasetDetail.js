import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { DATASET_DETAIL_QUERY } from '../shared/query/dataset'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import DatasetDetailRight from './DatasetDetailRight'
import DatasetDetailLeft from './DatasetDetailLeft'

const DatasetDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(DATASET_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.dataset) {
    return <NotFound />
  }

  const { dataset } = data

  const slugNameMapping = (() => {
    const map = {}
    map[dataset.slug] = dataset.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <DatasetDetailLeft scrollRef={scrollRef} dataset={dataset} />
        </div>
        <div className='lg:basis-2/3'>
          <DatasetDetailRight ref={scrollRef} dataset={dataset} />
        </div>
      </div>
    </div>
  )
}

export default DatasetDetail
