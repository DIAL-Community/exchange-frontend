import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '10rem',
    cursor: 'pointer'
  }),
  option: (provided) => ({
    ...provided,
    cursor: 'pointer'
  })
}

export const ProductTypeSelect = (props) => {
  const [productType, setProductType] = useState('')
  const { productTypes, setProductTypes, containerStyles } = props

  const selectProductType = (productType) => {
    setProductType('')
    setProductTypes([...productTypes.filter(p => p.value !== productType.value), productType])
  }

  const options = [
    { value: 'product_and_dataset', label: 'All Type' },
    { value: 'product', label: 'Product Only' },
    { value: 'dataset', label: 'Dataset Only' }
  ]

  const fetchOptions = async (input) => {
    return options.filter(o => o.label.indexOf(input) >= 0)
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>Product or Dataset?</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions={options}
          loadOptions={fetchOptions}
          onChange={selectProductType}
          placeholder='Filter by Type'
          styles={customStyles}
          value={productType}
        />
      </label>
    </div>
  )
}

export const ProductTypeFilters = (props) => {
  const { productTypes, setProductTypes } = props
  const removeProductType = (productTypeId) => {
    setProductTypes(productTypes.filter(productType => productType.value !== productTypeId))
  }

  return (
    <>
      {
        productTypes &&
          productTypes.map(productType => (
            <div key={`filter-${productType.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`Country: ${productType.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeProductType(productType.value)} />
            </div>
          ))
      }
    </>
  )
}
