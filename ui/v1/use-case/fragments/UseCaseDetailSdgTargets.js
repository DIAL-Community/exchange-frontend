import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import SdgTargetCard from '../../sdg-target/SdgTargetCard'
import { DisplayType } from '../../utils/constants'
import Select from '../../shared/form/Select'
import { fetchSelectOptions } from '../../utils/search'
import Pill from '../../shared/form/Pill'
import EditableSection from '../../shared/EditableSection'
import { UPDATE_USE_CASE_SDG_TARGETS } from '../../shared/mutation/useCase'
import { SDG_TARGET_SEARCH_QUERY } from '../../shared/query/sdgTarget'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'

const UseCaseDetailSdgTargets = ({ useCase, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [sdgTargets, setSdgTargets] = useState(useCase.sdgTargets)
  const [isDirty, setIsDirty] = useState(false)

  const [updateUseCaseSdgTargets, { loading, reset }] = useMutation(UPDATE_USE_CASE_SDG_TARGETS, {
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
      id: sdgTarget.id,
      name: sdgTarget.name,
      label: `${sdgTarget.targetNumber}. ${sdgTarget.name}`,
      targetNumber: sdgTarget.targetNumber,
      sdgNumber: sdgTarget.sdgNumber
    }))
  )

  const addSdgTargets = (sdgTarget) => {
    setSdgTargets([
      ...[
        ...sdgTargets.filter(({ id }) => id !== sdgTarget.id), {
          id: sdgTarget.id,
          name: sdgTarget.name,
          targetNumber: sdgTarget.targetNumber,
          sdgNumber: sdgTarget.sdgNumber
        }
      ].sort((a, b) => {
        const diff = parseInt(a.sdgNumber) - parseInt(b.sdgNumber)

        return diff === 0 ? a.targetNumber.localeCompare(b.targetNumber) : diff
      })
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
          sdgTargetIds: sdgTargets.map(({ id }) => parseInt(id)),
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
    setSdgTargets(useCase.sdgTargets)
    setIsDirty(false)
  }

  const displayModeBody = sdgTargets.length
    ? sdgTargets?.map((sdgTarget, index) =>
      <div key={`sdg-target-${index}`}>
        <SdgTargetCard sdgTarget={sdgTarget} displayType={DisplayType.SMALL_CARD} />
      </div>
    )
    : <div className='text-sm text-dial-stratos'>
      {format('ui.common.detail.noData', {
        entity: format('ui.sdgTarget.label'),
        base: format('ui.useCase.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-blueberry' ref={headerRef}>
      {format('ui.sdgTarget.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.sdgTarget.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, SDG_TARGET_SEARCH_QUERY, fetchedSdgTargetsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.sdgTarget.label') })}
          onChange={addSdgTargets}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {sdgTargets.map((sdgTarget, sdgTargetIdx) => (
          <Pill
            key={`sdgTargets-${sdgTargetIdx}`}
            label={
              `${sdgTarget.targetNumber}. ` +
              `${sdgTarget.name}`
            }
            onRemove={() => removeSdgTargets(sdgTarget)}
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

export default UseCaseDetailSdgTargets
