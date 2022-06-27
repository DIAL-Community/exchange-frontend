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

export const DatasetTypeSelect = (props) => {
  const { datasetTypes, setDatasetTypes, containerStyles, controlSize } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectDatasetType = (datasetType) => {
    setDatasetTypes([...datasetTypes.filter(p => p.value !== datasetType.value), datasetType])
  }

  const options = [
    { value: 'dataset_and_content', label: format('datasetType.allType') },
    { value: 'dataset', label: format('datasetType.datasetOnly') },
    { value: 'content', label: format('datasetType.contentOnly') },
    { value: 'standard', label: format('datasetType.standardOnly') },
    { value: 'ai_model', label: format('datasetType.aiModelOnly') }
  ]

  const fetchOptions = async (input) => {
    return options.filter(o => o.label.indexOf(input) >= 0)
  }

  return (
    <div className={`${containerStyles} catalog-filter text-dial-gray-dark flex`}>
      <AsyncSelect
        aria-label={format('filter.byEntity', { entity: format('datasetType.label') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions={options}
        loadOptions={fetchOptions}
        onChange={selectDatasetType}
        placeholder={format('filter.byEntity', { entity: format('datasetType.label') })}
        styles={customStyles(controlSize)}
        value=''
      />
    </div>
  )
}

export const DatasetTypeFilters = (props) => {
  const { datasetTypes, setDatasetTypes } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeDatasetType = (datasetTypeId) => {
    setDatasetTypes(datasetTypes.filter(datasetType => datasetType.value !== datasetTypeId))
  }

  return (
    <>
      {
        datasetTypes &&
          datasetTypes.map(datasetType => (
            <div key={`filter-${datasetType.label}`} className='px-2 py-1 my-auto rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('datasetType.label')}: ${datasetType.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeDatasetType(datasetType.value)} />
            </div>
          ))
      }
    </>
  )
}
