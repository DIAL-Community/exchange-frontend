import { useIntl } from 'react-intl'
import React, { useCallback, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'
import Select from '../form/Select'
import { ProductStageType } from '../../utils/constants'

export const ProductStageAutocomplete = ({ productStage, setProductStage }) => {

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const updateProductStageValue = (productStage) => setProductStage(productStage)

  const [selectedOption, setSelectedOption] = useState(productStage)

  const productStageOptions = Object.keys(ProductStageType).map((key) => ({
    value: ProductStageType[key],
    label: ProductStageType[key].charAt(0).toUpperCase() + ProductStageType[key].slice(1)
  }))

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-dial-stratos text-sm py-2'>
        {format('ui.productStage.header')}
      </div>
      <Select
        isBorderless
        options={productStageOptions}
        placeholder={format('filter.byEntity', { entity: format('ui.productStage.header') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        onChange={(value) => {
          updateProductStageValue(value.value)
          setSelectedOption(value)
        }}
        value={selectedOption}
      />
    </div>
  )
}

export const ProductStageActiveFilters = ({ productStage, setProductStage }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeProductStage = () => setProductStage(null)

  return (
    <>
      {productStage !== null &&
      <div className='bg-dial-slate-400 px-2 py-1 rounded'>
        <div className='flex flex-row gap-1'>
          <div className='text-white capitalize'>
            {productStage}
            <div className='mx-2 inline opacity-40'>
                ({format('ui.productStage.header')})
            </div>
          </div>
          <button onClick={() => removeProductStage()}>
            <FaXmark size='1rem' className='text-white' />
          </button>
        </div>
      </div>
      }
    </>
  )
}
