import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'
import { DATASET_SEARCH_QUERY } from '../../../queries/dataset'
import EditableSection from '../../shared/EditableSection'
import { ToastContext } from '../../../lib/ToastContext'
import { fetchSelectOptions } from '../../../queries/utils'
import DatasetCard from '../../datasets/DatasetCard'
import { UPDATE_USE_CASE_STEP_DATASETS } from '../../../mutations/useCaseStep'
import { useUser } from '../../../lib/hooks'

const UseCaseStepDetailDatasets = ({ useCaseStep, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const { locale } = useRouter()

  const client = useApolloClient()

  const [isDirty, setIsDirty] = useState(false)
  const [datasets, setDatasets] = useState(useCaseStep.datasets)

  const { showToast } = useContext(ToastContext)

  const [updateUseCaseStepDatasets, { data, loading, reset }] = useMutation(UPDATE_USE_CASE_STEP_DATASETS, {
    onCompleted: (data) => {
      const { updateUseCaseStepDatasets: response } = data
      if (response?.useCaseStep && response?.errors?.length === 0) {
        setIsDirty(false)
        setDatasets(response?.useCaseStep?.datasets)
        showToast(format('toast.datasets.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setDatasets(useCaseStep.datasets)
        showToast(format('toast.datasets.update.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setIsDirty(false)
      setDatasets(useCaseStep.datasets)
      showToast(format('toast.datasets.update.failure'), 'error', 'top-center')
      reset()
    }
  })

  const fetchedDatasetsCallback = (data) => (
    data.datasets?.map((dataset) => ({
      label: dataset.name,
      slug: dataset.slug
    }))
  )

  const addDataset = (dataset) => {
    setDatasets([
      ...datasets.filter(({ slug }) => slug !== dataset.slug),
      { name: dataset.label, slug: dataset.slug }
    ])
    setIsDirty(true)
  }

  const removeDataset = (dataset) => {
    setDatasets([...datasets.filter(({ slug }) => slug !== dataset.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateUseCaseStepDatasets({
        variables: {
          slug: useCaseStep.slug,
          datasetSlugs: datasets.map(({ slug }) => slug)
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const onCancel = () => {
    setDatasets(data?.updateUseCaseStepDatasets?.useCaseStep.datasets ?? useCaseStep.datasets)
    setIsDirty(false)
  }

  const displayModeBody = datasets.length
    ? (
      <div className='grid grid-cols-1'>
        {datasets.map((dataset, datasetIdx) => <DatasetCard key={datasetIdx} dataset={dataset} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('use-case-step.no-dataset')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('dataset.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='dataset-search'>
        {`${format('app.searchAndAssign')} ${format('dataset.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, DATASET_SEARCH_QUERY, fetchedDatasetsCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('dataset.header') })}
          onChange={addDataset}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {datasets.map((dataset, datasetIdx) => (
          <Pill
            key={`dataset-${datasetIdx}`}
            label={dataset.name}
            onRemove={() => removeDataset(dataset)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('dataset.header')}
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
