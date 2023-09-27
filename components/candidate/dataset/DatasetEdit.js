import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../../shared/Breadcrumb'
import { CANDIDATE_DATASET_DETAIL_QUERY } from '../../shared/query/candidateDataset'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import DatasetForm from './fragments/DatasetForm'
import DatasetEditLeft from './DatasetEditLeft'

const DatasetEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
    const map = {
      edit: format('app.edit')
    }
    map[dataset.slug] = dataset.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <DatasetEditLeft dataset={dataset} />
        </div>
        <div className='lg:basis-2/3'>
          <DatasetForm dataset={dataset} />
        </div>
      </div>
    </div>
  )
}

export default DatasetEdit
