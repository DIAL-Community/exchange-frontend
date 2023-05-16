import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { UPDATE_USE_CASE_STEP_BUILDING_BLOCKS } from '../../../mutations/useCaseStep'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../../queries/building-block'
import { fetchSelectOptions } from '../../../queries/utils'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'
import UseCaseBuildingBlock from '../UseCaseBuildingBlocks'

const UseCaseStepDetailBuildingBlocks = ({ useCaseStep, useCase, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [buildingBlocks, setBuildingBlocks] = useState([])
  const [useCaseBuildingBlocks, setUseCaseBuildingBlocks] = useState([])
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  useEffect(
    () => {
      setBuildingBlocks(useCaseStep.buildingBlocks)
      setUseCaseBuildingBlocks(useCase.buildingBlocks)
    },
    [useCaseStep, useCase]
  )

  const [updateUseCaseStepBuildingBlocks, { data, loading, reset }] = useMutation(
    UPDATE_USE_CASE_STEP_BUILDING_BLOCKS, {
      onCompleted: (data) => {
        const { updateUseCaseStepBuildingBlocks: response } = data
        if (response?.useCaseStep && response?.errors?.length === 0) {
          setIsDirty(false)
          setBuildingBlocks(response?.useCaseStep?.buildingBlocks)
          showToast(format('toast.buildingBlocks.update.success'), 'success', 'top-center')
        } else {
          setIsDirty(false)
          setBuildingBlocks(useCaseStep.buildingBlocks)
          showToast(format('toast.buildingBlocks.update.failure'), 'error', 'top-center')
          reset()
        }
      },
      onError: () => {
        setIsDirty(false)
        setBuildingBlocks(useCaseStep.buildingBlocks)
        showToast(format('toast.buildingBlocks.update.failure'), 'error', 'top-center')
        reset()
      }
    }
  )

  const fetchedBuildingBlocksCallback = (data) => (
    data.buildingBlocks.map((buildingBlock) => ({
      label: buildingBlock.name,
      slug: buildingBlock.slug
    }))
  )

  const addBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([
      ...buildingBlocks.filter(({ slug }) => slug !== buildingBlock.slug),
      { name: buildingBlock.label, slug: buildingBlock.slug }
    ])
    setIsDirty(true)
  }

  const removeBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([...buildingBlocks.filter(({ slug }) => slug !== buildingBlock.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateUseCaseStepBuildingBlocks({
        variables: {
          slug: useCaseStep.slug,
          buildingBlockSlugs: buildingBlocks.map(({ slug }) => slug)
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
    setBuildingBlocks(
      data?.updateUseCaseStepBuildingBlocks?.useCaseStep?.buildingBlocks ??
      useCaseStep.buildingBlocks
    )
    setIsDirty(false)
  }

  const displayModeBody =
    <UseCaseBuildingBlock
      useCaseBuildingBlocks={useCaseBuildingBlocks}
      stepBuildingBlocks={buildingBlocks}
    />

  const editModeBody =
    <div className='flex flex-col gap-3'>
      <p className='card-title text-dial-stratos'>
        {format('app.assign')} {format('building-block.header')}
      </p>
      <label className='flex flex-col gap-y-2' data-testid='building-block-search'>
        {`${format('app.searchAndAssign')} ${format('building-block.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={
            (input) =>
              fetchSelectOptions(
                client,
                input,
                BUILDING_BLOCK_SEARCH_QUERY,
                fetchedBuildingBlocksCallback
              )
          }
          noOptionsMessage={() =>
            format('filter.searchFor', { entity: format('building-block.header') })
          }
          onChange={addBuildingBlock}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {buildingBlocks.map((buildingBlock, index) => (
          <Pill
            key={`buildingBlock-${index}`}
            label={buildingBlock.name}
            onRemove={() => removeBuildingBlock(buildingBlock)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('building-block.header')}
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
