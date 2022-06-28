import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/client'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import EditableSection from '../shared/EditableSection'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_DATASET_SDGS } from '../../mutations/dataset'
import { fetchSelectOptions } from '../../queries/utils'
import SDGCard from '../sdgs/SDGCard'
import { SDG_SEARCH_QUERY } from '../../queries/sdg'

const DatasetDetailSdgs = ({ dataset, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const sdgMappingStatusTypes = [
    { label: format('dataset.mappingStatus.beta'), value: 'BETA' },
    { label: format('dataset.mappingStatus.mature'), value: 'MATURE' },
    { label: format('dataset.mappingStatus.selfReported'), value: 'SELF-REPORTED' },
    { label: format('dataset.mappingStatus.validated'), value: 'VALIDATED' }
  ]

  const client = useApolloClient()

  const [sdgs, setSdgs] = useState(dataset.sustainableDevelopmentGoals)
  const [mappingStatus, setMappingStatus] = useState(
    sdgMappingStatusTypes.filter(({ value }) => dataset.sustainableDevelopmentGoalMapping === value).shift()
  )
  const [isDirty, setIsDirty] = useState(false)

  const [updateDatasetSdgs, { data, loading }] = useMutation(UPDATE_DATASET_SDGS)

  const [session] = useSession()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  useEffect(() => {
    if (data?.updateDatasetSdgs?.errors.length === 0 && data?.updateDatasetSdgs?.dataset) {
      setSdgs(data.updateDatasetSdgs.dataset.sustainableDevelopmentGoals)
      showToast(format('dataset.sdgs.updated'), 'success', 'top-center')
      setIsDirty(false)
    }
  }, [data, showToast, format])

  const fetchedSdgsCallback = (data) => (
    data.sdgs.map((sdg) => ({
      label: sdg.name,
      value: sdg.id,
      slug: sdg.slug
    }))
  )

  const updateMappingStatus = (selectedMappingStatus) => {
    setMappingStatus(selectedMappingStatus)
    setIsDirty(true)
  }

  const addSdg = (sdg) => {
    setSdgs([...sdgs.filter(({ slug }) => slug !== sdg.slug), { name: sdg.label, slug: sdg.slug }])
    setIsDirty(true)
  }

  const removeSdg = (sdg) => {
    setSdgs([...sdgs.filter(({ slug }) => slug !== sdg.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (session) {
      const { userEmail, userToken } = session.user

      updateDatasetSdgs({
        variables: {
          slug: dataset.slug,
          mappingStatus: mappingStatus.value,
          sdgSlugs: sdgs.map(({ slug }) => slug)
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
    setSdgs(data?.updateDatasetSdgs?.dataset?.sustainableDevelopmentGoals ?? dataset.sustainableDevelopmentGoals)
    setIsDirty(false)
  }

  const displayModeBody = sdgs.length > 0
    ? (
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        {sdgs.map((sdg, sdgIdx) => <SDGCard key={sdgIdx} sdg={sdg} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('dataset.no-sdg')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-blue mb-3'>
        {format('app.assign')} {format('sdg.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2'>
        {format('dataset.sdg.mappingStatus')}
        <Select
          options={sdgMappingStatusTypes}
          placeholder={format('dataset.sdg.mappingStatus')}
          onChange={updateMappingStatus}
          value={mappingStatus}
        />
      </label>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='sdg-search'>
        {`${format('app.searchAndAssign')} ${format('sdg.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, SDG_SEARCH_QUERY, fetchedSdgsCallback, locale)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('sdg.header') })}
          onChange={addSdg}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {sdgs.map((sdg, sdgIdx) => (
          <Pill
            key={`sdg-${sdgIdx}`}
            label={sdg.name}
            onRemove={() => removeSdg(sdg)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('sdg.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default DatasetDetailSdgs