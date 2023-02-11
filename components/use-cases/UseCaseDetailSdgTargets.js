import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { ToastContext } from '../../lib/ToastContext'
import { SDG_TARGET_SEARCH_QUERY } from '../../queries/sdg-target'
import { fetchSelectOptions } from '../../queries/utils'
import EditableSection from '../shared/EditableSection'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import { UPDATE_USE_CASE_SDG_TARGETS } from '../../mutations/use-case'
import SDGTargetCard from '../sdgs/SdgTargetCard'
import { useUser } from '../../lib/hooks'

const SDG_TARGET_NAME_INDEX_START = 0
const SDG_TARGET_NAME_INDEX_END = 40

const UseCaseDetailSdgTargets = ({ useCase, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [sdgTargets, setSdgTargets] = useState(useCase.sdgTargets)
  const [isDirty, setIsDirty] = useState(false)

  const [updateUseCaseSdgTargets, { data, loading, reset }] = useMutation(UPDATE_USE_CASE_SDG_TARGETS,{
    onError() {
      setIsDirty(false)
      setSdgTargets(useCase?.sdgTargets)
      showToast(format('toast.sdgTargets.update.failure'), 'error', 'top-center')
      reset()
    },
    onCompleted: (data) => {
      const { updateUseCaseSdgTargets: response } = data
      if (response?.useCase && response?.errors?.length === 0) {
        setIsDirty(false)
        setSdgTargets(response?.useCase?.sdgTargets)
        showToast(format('toast.sdgTargets.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setSdgTargets(useCase?.sdgTargets)
        showToast(format('toast.sdgTargets.update.failure'), 'error', 'top-center')
        reset()
      }
    }
  })

  const { user } = useUser()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const fetchedSdgTargetsCallback = (data) => (
    data.sdgTargets?.map((sdgTarget) => ({
      label: `${sdgTarget.targetNumber}: ${sdgTarget.name}`,
      name: sdgTarget.name,
      id: sdgTarget.id,
      targetNumber: sdgTarget.targetNumber,
      slug: sdgTarget.sustainableDevelopmentGoal.slug,
    }))
  )

  const addSdgTargets = (sdgTarget) => {
    setSdgTargets([
      ...sdgTargets.filter(({ id }) => id !== sdgTarget.id),
      { name: sdgTarget.name, targetNumber: sdgTarget.targetNumber, id: sdgTarget.id }
    ])
    setIsDirty(true)
  }

  const removeSdgTargets = (sdgTarget) => {
    setSdgTargets([...sdgTargets.filter(({ id }) => id !== sdgTarget.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateUseCaseSdgTargets({
        variables: {
          sdgTargetsIds: sdgTargets.map(({ id }) => parseInt(id)),
          slug: useCase.slug
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
    setSdgTargets(data?.updateUseCaseSdgTargets?.useCase?.sdgTargets ?? useCase.sdgTargets)
    setIsDirty(false)
  }

  const displayModeBody = sdgTargets.length
    ? (
      <div className='grid grid-cols-1'>
        {sdgTargets.map((sdgTarget, sdgTargetIdx) => <SDGTargetCard key={sdgTargetIdx} sdgTarget={sdgTarget} />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('use-case.no-sdg-targets')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-blue mb-3'>
        {format('app.assign')} {format('sdg-target.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='sdg-targets-search'>
        {`${format('app.searchAndAssign')} ${format('sdg-target.label')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, SDG_TARGET_SEARCH_QUERY, fetchedSdgTargetsCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('sdg-target.label') })}
          onChange={addSdgTargets}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {sdgTargets.map((sdgTarget, sdgTargetIdx) => (
          <Pill
            key={`sdgTargets-${sdgTargetIdx}`}
            label={
              `${sdgTarget.targetNumber}: ` +
              `${sdgTarget.name.substring(SDG_TARGET_NAME_INDEX_START, SDG_TARGET_NAME_INDEX_END)}...`
            }
            onRemove={() => removeSdgTargets(sdgTarget)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('sdg-target.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default UseCaseDetailSdgTargets
