import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import DatasetCard from '../../dataset/DatasetCard'
import { DisplayType } from '../../utils/constants'
import Select from '../../shared/form/Select'
import { fetchSelectOptions } from '../../utils/search'
import Pill from '../../shared/form/Pill'
import EditableSection from '../../shared/EditableSection'
import { UPDATE_USE_CASE_STEP_DATASETS } from '../../shared/mutation/useCaseStep'
import { DATASET_SEARCH_QUERY } from '../../shared/query/dataset'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'

const UseCaseStepDetailDatasets = ({ useCaseStep, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [datasets, setDatasets] = useState(useCaseStep.datasets)
  const [isDirty, setIsDirty] = useState(false)

  const [updateUseCaseStepDatasets, { loading, reset }] = useMutation(UPDATE_USE_CASE_STEP_DATASETS, {
    onError() {
      setIsDirty(false)
      setDatasets(useCaseStep?.datasets)
      showToast(format('toast.datasets.update.failure'), 'error', 'top-center')
      reset()
    },
    onCompleted: (data) => {
      const { updateUseCaseStepDatasets: response } = data
      if (response?.useCaseStep && response?.errors?.length === 0) {
        setIsDirty(false)
        setDatasets(response?.useCaseStep?.datasets)
        showToast(format('toast.datasets.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setDatasets(useCaseStep?.datasets)
        showToast(format('toast.datasets.update.failure'), 'error', 'top-center')
        reset()
      }
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const fetchedDatasetsCallback = (data) => (
    data.datasets?.map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      slug: dataset.slug,
      label: dataset.name
    }))
  )

  const addDatasets = (dataset) => {
    setDatasets([
      ...[
        ...datasets.filter(({ id }) => id !== dataset.id),
        { id: dataset.id, name: dataset.name, slug: dataset.slug }
      ]
    ])
    setIsDirty(true)
  }

  const removeDatasets = (dataset) => {
    setDatasets([...datasets.filter(({ id }) => id !== dataset.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateUseCaseStepDatasets({
        variables: {
          datasetSlugs: datasets.map(({ slug }) => slug),
          slug: useCaseStep.slug
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
    setDatasets(useCaseStep.datasets)
    setIsDirty(false)
  }

  const displayModeBody = datasets.length
    ? (datasets?.map((dataset, index) =>
      <div key={`dataset-${index}`}>
        <DatasetCard dataset={dataset} displayType={DisplayType.SMALL_CARD} />
      </div>
    )) : (
      <div className='text-sm text-dial-stratos'>
        {format('ui.common.detail.noData', { entity: format('ui.dataset.label') })}
      </div>
    )

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-blueberry' ref={headerRef}>
      {format('ui.dataset.header')}
    </div>

  const editModeBody =
    <div className='px-8 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.dataset.label')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, DATASET_SEARCH_QUERY, fetchedDatasetsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.dataset.label') })}
          onChange={addDatasets}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {datasets.map((dataset, datasetIdx) => (
          <Pill
            key={`datasets-${datasetIdx}`}
            label={dataset.name}
            onRemove={() => removeDatasets(dataset)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={sectionHeader}
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
