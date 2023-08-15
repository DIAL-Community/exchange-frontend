import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Breadcrumb from '../Breadcrumb'
import DatasetForm from './fragments/DatasetForm'
import DatasetSimpleLeft from './fragments/DatasetSimpleLeft'

const DatasetCreate = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slugNameMapping = (() => {
    const map = {
      create: format('app.create')
    }

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row'>
        <div className='lg:basis-1/3'>
          <DatasetSimpleLeft />
        </div>
        <div className='lg:basis-2/3'>
          <DatasetForm />
        </div>
      </div>
    </div>
  )
}

export default DatasetCreate
