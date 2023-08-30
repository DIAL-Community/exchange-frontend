import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'

export const DatasetTypeSelect = ({
  datasetTypes,
  setDatasetTypes,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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

  return (
    <div className={classNames(containerStyles)} data-testid='dataset-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('ui.datasetType.label') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions={options}
        loadOptions={fetchOptions}
        onChange={selectDatasetType}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const DatasetTypeFilters = (props) => {
  const { datasetTypes, setDatasetTypes } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeDatasetType = (datasetTypeValue) => {
    setDatasetTypes(datasetTypes.filter(({ value }) => value !== datasetTypeValue))
  }

  return (
    <>
      {datasetTypes?.map((datasetType, datasetTypeIdx) => (
        <div className='py-1' key={datasetTypeIdx}>
          <Pill
            key={`filter-${datasetTypeIdx}`}
            label={`${format('ui.datasetType.label')}: ${datasetType.label}`}
            onRemove={() => removeDatasetType(datasetType.value)}
          />
        </div>
      ))}
    </>
  )
}
