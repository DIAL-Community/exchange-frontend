import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_OPPORTUNITY_BUILDING_BLOCKS } from '../../mutations/opportunity'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../queries/building-block'
import { fetchSelectOptions } from '../../queries/utils'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import EditableSection from '../shared/EditableSection'
import Pill from '../shared/Pill'
import Select from '../shared/Select'

const OpportunityDetailBuildingBlocks = ({ opportunity, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const { user } = useUser()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const [buildingBlocks, setBuildingBlocks] = useState(opportunity.buildingBlocks)

  const [isDirty, setIsDirty] = useState(false)

  const [updateOpportunityBuildingBlocks, { data, loading, reset }] = useMutation(
    UPDATE_OPPORTUNITY_BUILDING_BLOCKS, {
      onCompleted: (data) => {
        const { updateOpportunityBuildingBlocks: response } = data
        if (response?.opportunity && response?.errors?.length === 0) {
          setIsDirty(false)
          setBuildingBlocks(response?.opportunity?.buildingBlocks)
          showToast(format('toast.buildingBlocks.update.success'), 'success', 'top-center')
        } else {
          setIsDirty(false)
          setBuildingBlocks(opportunity.buildingBlocks)
          showToast(format('toast.buildingBlocks.update.failure'), 'error', 'top-center')
          reset()
        }
      },
      onError: () => {
        setIsDirty(false)
        setBuildingBlocks(opportunity.buildingBlocks)
        showToast(format('toast.buildingBlocks.update.failure'), 'error', 'top-center')
        reset()
      }
    }
  )

  const fetchedBuildingBlocksCallback = (data) => (
    data.buildingBlocks.map((buildingBlock) => ({
      label: buildingBlock.name,
      value: buildingBlock.id,
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

      updateOpportunityBuildingBlocks({
        variables: {
          slug: opportunity.slug,
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
    const buildingBlocks = data?.updateOpportunityBuildingBlocks?.opportunity?.buildingBlocks
    setBuildingBlocks(buildingBlocks ?? opportunity.buildingBlocks)
    setIsDirty(false)
  }

  const disclaimer =
    <div
      className='text-sm text-dial-gray-dark pb-2 highlight-link'
      dangerouslySetInnerHTML={{ __html: format('building-block.disclaimer') }}
    />

  const displayModeBody =
    <>
      {disclaimer}
      {buildingBlocks.length > 0 ? (
        <div className='grid grid-cols-1'>
          {buildingBlocks.map((buildingBlock, buildingBlockIdx) =>
            <BuildingBlockCard key={buildingBlockIdx} buildingBlock={buildingBlock} listType='list' />
          )}
        </div>
      ) : (
        <div className='text-sm pb-5 text-button-gray'>
          {format('opportunity.no-building-block')}
        </div>
      )}
    </>

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('building-block.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='building-block-search'>
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
        {buildingBlocks.map((buildingBlock, buildingBlockIdx) => (
          <Pill
            key={`buildingBlock-${buildingBlockIdx}`}
            label={buildingBlock.name}
            onRemove={() => removeBuildingBlock(buildingBlock)}
          />
        ))}
      </div>
    </>

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

export default OpportunityDetailBuildingBlocks
