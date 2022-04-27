import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { useIntl } from 'react-intl'
import { asyncSelectStyles } from '../../../lib/utilities'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const customStyles = (controlSize = '12rem') => {
  return {
    ...asyncSelectStyles,
    control: (provided) => ({
      ...provided,
      width: controlSize,
      boxShadow: 'none',
      cursor: 'pointer'
    }),
    option: (provided) => ({
      ...provided,
      cursor: 'pointer'
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 30 }),
    menu: (provided) => ({ ...provided, zIndex: 30 })
  }
}

export const ProductTypeSelect = (props) => {
  const { productTypes, setProductTypes, containerStyles, controlSize } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectProductType = (productType) => {
    setProductTypes([...productTypes.filter(p => p.value !== productType.value), productType])
  }

  const options = [
    { value: 'product_and_dataset', label: format('productType.allType') },
    { value: 'product', label: format('productType.productOnly') },
    { value: 'dataset', label: format('productType.datasetOnly') }
  ]

  const fetchOptions = async (input) => {
    return options.filter(o => o.label.indexOf(input) >= 0)
  }

  return (
    <div className={`${containerStyles} catalog-filter text-dial-gray-dark flex`}>
      <AsyncSelect
        aria-label={format('filter.byEntity', { entity: format('productType.label') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions={options}
        loadOptions={fetchOptions}
        onChange={selectProductType}
        placeholder={format('filter.byEntity', { entity: format('productType.label') })}
        styles={customStyles(controlSize)}
        value=''
      />
    </div>
  )
}

export const ProductTypeFilters = (props) => {
  const { productTypes, setProductTypes } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeProductType = (productTypeId) => {
    setProductTypes(productTypes.filter(productType => productType.value !== productTypeId))
  }

  return (
    <>
      {
        productTypes &&
          productTypes.map(productType => (
            <div key={`filter-${productType.label}`} className='px-2 py-1 my-auto rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('productType.label')}: ${productType.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeProductType(productType.value)} />
            </div>
          ))
      }
    </>
  )
}
