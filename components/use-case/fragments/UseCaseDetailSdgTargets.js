import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import SdgTargetCard from '../../sdg-target/SdgTargetCard'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import HidableSection from '../../shared/HidableSection'
import { UPDATE_USE_CASE_SDG_TARGETS } from '../../shared/mutation/useCase'
import { SDG_TARGET_SEARCH_QUERY } from '../../shared/query/sdgTarget'
import { DisplayType, ObjectType } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'

const UseCaseDetailSdgTargets = ({ useCase, editingAllowed, editingSection, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [sdgTargets, setSdgTargets] = useState(useCase.sdgTargets)
  const [isDirty, setIsDirty] = useState(false)

  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateUseCaseSdgTargets, { loading, reset }] = useMutation(UPDATE_USE_CASE_SDG_TARGETS, {
    onError() {
      setIsDirty(false)
      setSdgTargets(useCase?.sdgTargets)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.sdtTarget.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateUseCaseSdgTargets: response } = data
      if (response?.useCase && response?.errors?.length === 0) {
        setIsDirty(false)
        setSdgTargets(response?.useCase?.sdgTargets)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.sdtTarget.header') }))
      } else {
        setIsDirty(false)
        setSdgTargets(useCase?.sdgTargets)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.sdtTarget.header') }))
        reset()
      }
    }
  })

  const fetchedSdgTargetsCallback = (data) => (
    data.sdgTargets?.map((sdgTarget) => ({
      id: sdgTarget.id,
      name: sdgTarget.name,
      label: `${sdgTarget.targetNumber}. ${sdgTarget.name}`,
      targetNumber: sdgTarget.targetNumber,
      sdgNumber: sdgTarget.sdgNumber
    }))
  )

  const addSdgTarget = (sdgTarget) => {
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

  const removeSdgTarget = (sdgTarget) => {
    setSdgTargets([...sdgTargets.filter(({ id }) => id !== sdgTarget.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    updateUseCaseSdgTargets({
      variables: {
        sdgTargetIds: sdgTargets.map(({ id }) => parseInt(id)),
        slug: useCase.slug
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
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

  const sectionDisclaimer =
    <div className='text-xs text-justify italic text-dial-stratos mb-2'>
      {format('ui.useCase.overview.sdg')}
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
          onChange={addSdgTarget}
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
            onRemove={() => removeSdgTarget(sdgTarget)}
          />
        ))}
      </div>
    </div>

  const hidableSection = (
    <HidableSection
      objectKey='sdgTargets'
      objectType={ObjectType.USE_CASE}
      disabled={!editingSection}
      displayed={editingAllowed}
    />
  )

  return (
    <EditableSection
      editingAllowed={editingAllowed}
      hidableSection={hidableSection}
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

export default UseCaseDetailSdgTargets
