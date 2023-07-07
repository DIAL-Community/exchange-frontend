import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/Breadcrumb'
import ProductForm from './fragments/ProductForm'
import ProductSimpleLeft from './fragments/ProductSimpleLeft'

const ProductCreate = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slugNameMapping = (() => {
    const map = {
      create: format('app.create')
    }

    return map
  })()

  return (
    <div className='px-8 xl:px-56 flex flex-col'>
      <div className='px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='col-span-1'>
          <ProductSimpleLeft />
        </div>
        <div className='col-span-2'>
          <ProductForm />
        </div>
      </div>
    </div>
  )
}

export default ProductCreate
