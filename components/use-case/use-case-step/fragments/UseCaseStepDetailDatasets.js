import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { ToastContext } from '../../../../lib/ToastContext'
import DatasetCard from '../../../dataset/DatasetCard'
import EditableSection from '../../../shared/EditableSection'
import Pill from '../../../shared/form/Pill'
import Select from '../../../shared/form/Select'
import { UPDATE_USE_CASE_STEP_DATASETS } from '../../../shared/mutation/useCaseStep'
import { DATASET_SEARCH_QUERY } from '../../../shared/query/dataset'
import { DisplayType } from '../../../utils/constants'
import { fetchSelectOptions } from '../../../utils/search'

const UseCaseStepDetailDatasets = ({ useCaseStep, editingAllowed, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [datasets, setDatasets] = useState(useCaseStep.datasets)
  const [isDirty, setIsDirty] = useState(false)

  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateUseCaseStepDatasets, { loading, reset }] = useMutation(UPDATE_USE_CASE_STEP_DATASETS, {
    onError() {
      setIsDirty(false)
      setDatasets(useCaseStep?.datasets)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.dataset.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateUseCaseStepDatasets: response } = data
      if (response?.useCaseStep && response?.errors?.length === 0) {
        setIsDirty(false)
        setDatasets(response?.useCaseStep?.datasets)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.dataset.header') }))
      } else {
        setIsDirty(false)
        setDatasets(useCaseStep?.datasets)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.dataset.header') }))
        reset()
      }
    }
  })

  const fetchedDatasetsCallback = (data) => (
    data.datasets?.map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      slug: dataset.slug,
      label: dataset.name
    }))
  )

  const addDataset = (dataset) => {
    setDatasets([
      ...[
        ...datasets.filter(({ id }) => id !== dataset.id),
        { id: dataset.id, name: dataset.name, slug: dataset.slug }
      ]
    ])
    setIsDirty(true)
  }

  const removeDataset = (dataset) => {
    setDatasets([...datasets.filter(({ id }) => id !== dataset.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    updateUseCaseStepDatasets({
      variables: {
        datasetSlugs: datasets.map(({ slug }) => slug),
        slug: useCaseStep.slug
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const onCancel = () => {
    setDatasets(useCaseStep.datasets)
    setIsDirty(false)
  }

  const displayModeBody = datasets.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
      {datasets?.map((dataset, index) =>
        <div key={`dataset-${index}`}>
          <DatasetCard dataset={dataset} displayType={DisplayType.SMALL_CARD} />
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.dataset.label'),
        base: format('ui.useCaseStep.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-blueberry' ref={headerRef}>
      {format('ui.dataset.header')}
    </div>

  const sectionDisclaimer =
    <div className='text-xs text-justify italic text-dial-stratos mb-2'>
      {format('ui.useCaseStep.overview.dataset')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.dataset.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, DATASET_SEARCH_QUERY, fetchedDatasetsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.dataset.label') })}
          onChange={addDataset}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {datasets.map((dataset, datasetIdx) => (
          <Pill
            key={`datasets-${datasetIdx}`}
            label={dataset.name}
            onRemove={() => removeDataset(dataset)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      editingAllowed={editingAllowed}
      sectionHeader={sectionHeader}
      sectionDisclaimer={sectionDisclaimer}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default UseCaseStepDetailDatasets
