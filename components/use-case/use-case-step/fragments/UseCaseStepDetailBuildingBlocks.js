import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import EditableSection from '../../../shared/EditableSection'
import Pill from '../../../shared/form/Pill'
import Select from '../../../shared/form/Select'
import { UPDATE_USE_CASE_STEP_BUILDING_BLOCKS } from '../../../shared/mutation/useCaseStep'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../../shared/query/buildingBlock'
import { fetchSelectOptions } from '../../../utils/search'
import UseCaseBuildingBlockRenderer from '../../custom/BuildingBlockRenderer'

const UseCaseStepDetailBuildingBlocks = ({ useCase, useCaseStep, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [isDirty, setIsDirty] = useState(false)
  const [useCaseBuildingBlocks] = useState(useCase.buildingBlocks)
  const [buildingBlocks, setBuildingBlocks] = useState(useCaseStep.buildingBlocks)

  const [updateUseCaseStepBuildingBlocks, { loading, reset }] = useMutation(UPDATE_USE_CASE_STEP_BUILDING_BLOCKS, {
    onError() {
      setIsDirty(false)
      setBuildingBlocks(useCaseStep?.buildingBlocks)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.buildingBlock.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateUseCaseStepBuildingBlocks: response } = data
      if (response?.useCaseStep && response?.errors?.length === 0) {
        setIsDirty(false)
        setBuildingBlocks(response?.useCaseStep?.buildingBlocks)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.buildingBlock.header') }))
      } else {
        setIsDirty(false)
        setBuildingBlocks(useCaseStep?.buildingBlocks)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.buildingBlock.header') }))
        reset()
      }
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const fetchedBuildingBlocksCallback = (data) => (
    data.buildingBlocks?.map((buildingBlock) => ({
      id: buildingBlock.id,
      name: buildingBlock.name,
      slug: buildingBlock.slug,
      label: buildingBlock.name
    }))
  )

  const addBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([
      ...[
        ...buildingBlocks.filter(({ id }) => id !== buildingBlock.id),
        { id: buildingBlock.id, name: buildingBlock.name, slug: buildingBlock.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([...buildingBlocks.filter(({ id }) => id !== buildingBlock.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateUseCaseStepBuildingBlocks({
        variables: {
          buildingBlockSlugs: buildingBlocks.map(({ slug }) => slug),
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
    setBuildingBlocks(useCaseStep.buildingBlocks)
    setIsDirty(false)
  }

  const displayModeBody = buildingBlocks.length
    ? <UseCaseBuildingBlockRenderer
      useCaseBuildingBlocks={useCaseBuildingBlocks}
      stepBuildingBlocks={buildingBlocks}
    />
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.buildingBlock.label'),
        base: format('ui.useCaseStep.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-blueberry' ref={headerRef}>
      {format('ui.buildingBlock.header')}
    </div>

  const sectionDisclaimer =
    <div className='text-xs text-justify italic text-dial-stratos mb-2'>
      {format('ui.useCaseStep.overview.buildingBlock')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.buildingBlock.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, BUILDING_BLOCK_SEARCH_QUERY, fetchedBuildingBlocksCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.buildingBlock.label') })}
          onChange={addBuildingBlock}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {buildingBlocks.map((buildingBlock, buildingBlockIdx) => (
          <Pill
            key={`buildingBlocks-${buildingBlockIdx}`}
            label={buildingBlock.name}
            onRemove={() => removeBuildingBlock(buildingBlock)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      canEdit={canEdit}
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

export default UseCaseStepDetailBuildingBlocks
