import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useApolloClient } from '@apollo/client'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { DATASET_SEARCH_QUERY } from '../../shared/query/dataset'
import { fetchSelectOptions } from '../../utils/search'

const SyncDatasets = ({ datasets, setDatasets }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const fetchDatasetsCallback = (data) => (
    data.datasets?.map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      slug: dataset.slug,
      label: dataset.name
    }))
  )

  const removeDataset = (dataset) => {
    setDatasets([...datasets.filter(({ id }) => id !== dataset.id)])
  }

  const addDataset = (dataset) => {
    setDatasets([
      ...[
        ...datasets.filter(({ id }) => id !== dataset.id),
        { id: dataset.id, name: dataset.name, slug: dataset.slug }
      ]
    ])
  }

  return (

    <div className='flex flex-col'>
      <ul className="flex flex-wrap gap-x-4 -mb-px">
        <li className="me-2">
          <div href='#' className='inline-block py-3 border-b-2 border-dial-sunshine'>
            {format('ui.dataset.header')}
          </div>
        </li>
      </ul>
      <div className='flex flex-col gap-y-3 border px-6 py-4'>
        <label className='flex flex-col gap-y-2'>
          {`${format('ui.syncTenant.searchFor')} ${format('ui.dataset.label')}`}
          <Select
            async
            isSearch
            isBorderless
            defaultOptions
            cacheOptions
            placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
            loadOptions={(input) =>
              fetchSelectOptions(client, input, DATASET_SEARCH_QUERY, fetchDatasetsCallback)
            }
            noOptionsMessage={() => format('ui.syncTenant.searchFor', { entity: format('ui.dataset.label') })}
            onChange={addDataset}
            value={null}
          />
        </label>
        <div className='flex flex-wrap gap-3'>
          {datasets.map((dataset, datasetIdx) => (
            <Pill
              key={`author-${datasetIdx}`}
              label={dataset.name}
              onRemove={() => removeDataset(dataset)}
            />
          ))}
        </div>
      </div>
    </div>
  )

}

export default SyncDatasets
