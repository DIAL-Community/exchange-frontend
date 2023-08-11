import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import { useUser } from '../../../lib/hooks'
import Select from '../../shared/Select'
import Pill from '../../shared/Pill'
import EditableSection from '../../shared/EditableSection'
import { UPDATE_ORGANIZATION_BUILDING_BLOCKS } from '../../../mutations/organization'
import { fetchSelectOptions } from '../../../queries/utils'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../../queries/building-block'
import UseCaseBuildingBlock from '../../use-cases/UseCaseBuildingBlocks'

const StorefrontDetailBuildingBlocks = ({ organization, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [isDirty, setIsDirty] = useState(false)
  const [buildingBlocks, setBuildingBlocks] = useState(organization.buildingBlockCertifications ?? [])

  const [updateBuildingBlocks, { reset, loading }] = useMutation(UPDATE_ORGANIZATION_BUILDING_BLOCKS, {
    onCompleted: (data) => {
      const { updateOrganizationBuildingBlocks: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        showToast(format('organization.submit.success'), 'success', 'top-center')
        setBuildingBlocks(response?.organization.buildingBlockCertifications)
        setIsDirty(false)
      } else {
        showToast(format('organization.submit.failure'), 'error', 'top-center')
        setBuildingBlocks(organization.buildingBlockCertifications ?? [])
        setIsDirty(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('organization.submit.failure'), 'error', 'top-center')
      setBuildingBlocks(organization.buildingBlockCertifications ?? [])
      setIsDirty(false)
      reset()
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const addBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([...buildingBlocks.filter(existing => existing.slug !== buildingBlock.slug), buildingBlock])
    setIsDirty(true)
  }

  const removeBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([...buildingBlocks.filter(existing => existing.slug !== buildingBlock.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateBuildingBlocks({
        variables: {
          slug: organization.slug,
          buildingBlockSlugs: buildingBlocks.map(buildingBlock => buildingBlock.slug)
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
    setBuildingBlocks(organization.buildingBlockCertifications)
    setIsDirty(false)
  }

  const displayModeBody = buildingBlocks?.length > 0
    ? (
      <UseCaseBuildingBlock useCaseBuildingBlocks={buildingBlocks} />
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('storefront.no-buildingBlock')}
      </div>
    )

  const fetchedBuildingBlocksCallback = (data) => (
    data.buildingBlocks.map((buildingBlock) => ({
      label: buildingBlock.name,
      value: buildingBlock.id,
      name: buildingBlock.name,
      slug: buildingBlock.slug
    }))
  )

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('ui.buildingBlock.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='buildingBlock-search'>
        {`${format('app.searchAndAssign')} ${format('ui.buildingBlock.header')}`}
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
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.buildingBlock.header') })}
          onChange={addBuildingBlock}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {buildingBlocks?.map((buildingBlock, index) => (
          <Pill
            key={`buildingBlock-${index}`}
            label={buildingBlock.name}
            onRemove={() => removeBuildingBlock(buildingBlock)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('ui.buildingBlock.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default StorefrontDetailBuildingBlocks
