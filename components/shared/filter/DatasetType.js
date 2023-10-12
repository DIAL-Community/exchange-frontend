import { useIntl } from 'react-intl'
import { BsDash, BsPlus } from 'react-icons/bs'
import { FaXmark } from 'react-icons/fa6'
import { useCallback, useState } from 'react'
import Select from '../form/Select'

export const DatasetTypeSelect = ({
  datasetTypes,
  setDatasetTypes,
  placeholder = null,
  isSearch = false
}) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [showFilter, setShowFilter] = useState(false)

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.datasetType.label') })

  const selectDatasetType = (datasetType) => {
    setDatasetTypes([...datasetTypes.filter(({ value }) => value !== datasetType.value), datasetType])
  }

  const options = [
    { value: 'dataset_and_content', label: format('ui.datasetType.allType') },
    { value: 'dataset', label: format('ui.datasetType.datasetOnly') },
    { value: 'content', label: format('ui.datasetType.contentOnly') },
    { value: 'standard', label: format('ui.datasetType.standardOnly') },
    { value: 'ai_model', label: format('ui.datasetType.aiModelOnly') }
  ]

  const fetchOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  const toggleFilter = (event) => {
    event.preventDefault()
    setShowFilter(!showFilter)
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <a href='#' className='flex' onClick={toggleFilter}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.datasetType.label')}
        </div>
        {showFilter
          ? <BsDash className='ml-auto text-dial-stratos my-auto' />
          : <BsPlus className='ml-auto text-dial-stratos my-auto' />
        }
      </a>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format('ui.datasetType.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions={options}
          loadOptions={fetchOptions}
          onChange={selectDatasetType}
          placeholder={controlPlaceholder}
          value=''
          isSearch={isSearch}
        />
      }
    </div>
  )
}

export const DatasetTypeActiveFilters = ({ datasetTypes, setDatasetTypes }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeDatasetType = (datasetTypeValue) => {
    setDatasetTypes(datasetTypes.filter(({ value }) => value !== datasetTypeValue))
  }

  return (
    <>
      {datasetTypes?.map((datasetType, countryIndex) => (
        <div key={countryIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {datasetType.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.buildingBlock.label')})
              </div>
            </div>
            <button onClick={() => removeDatasetType(datasetType.value)}>
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
