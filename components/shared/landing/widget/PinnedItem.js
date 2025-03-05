import { FormattedMessage } from 'react-intl'
import { fetchSelectOptions, fetchSelectOptionsWithMaturity } from '../../../utils/search'
import Select from '../../form/Select'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../query/buildingBlock'
import { ORGANIZATION_SEARCH_QUERY } from '../../query/organization'
import { PRODUCT_SEARCH_QUERY } from '../../query/product'
import { PROJECT_SEARCH_QUERY } from '../../query/project'
import { USE_CASE_SEARCH_QUERY } from '../../query/useCase'
import { PinnedItemTypes } from '../constants'
import PinnedBuildingBlock from './PinnedBuildingBlock'
import PinnedOrganization from './PinnedOrganization'
import PinnedProduct from './PinnedProduct'
import PinnedProject from './PinnedProject'
import PinnedUseCase from './PinnedUseCase'

export const renderItemValueOptions = (client, item, handleExtendedDataChange) => {
  switch (item.extendedData.itemType) {
    case PinnedItemTypes.PINNED_BUILDING_BLOCK:
      return (
        <div className='form-field-wrapper'>
          <label htmlFor='pinned-item-slug'>
            <FormattedMessage id='landing.pinned.buildingBlock' />
          </label>
          <Select
            async
            id='pinned-item-slug'
            borderless
            className='text-sm'
            loadOptions={
              input => fetchSelectOptions(
                client,
                input,
                BUILDING_BLOCK_SEARCH_QUERY,
                data =>
                  data?.buildingBlocks.map((buildingBlock) => ({
                    label: buildingBlock.name,
                    value: buildingBlock.slug
                  }))
              )
            }
            onChange={(e) => handleExtendedDataChange('itemSlug', e.value)}
          />
          <span className='text-xs italic'>
            <FormattedMessage id='landing.widget.selected.value' />
            {`: ${item.extendedData?.itemSlug}`}
          </span>
        </div>
      )
    case PinnedItemTypes.PINNED_PRODUCT:
      return (
        <div className='form-field-wrapper'>
          <label htmlFor='pinned-item-slug'>
            <FormattedMessage id='landing.pinned.product' />
          </label>
          <Select
            async
            id='pinned-item-slug'
            borderless
            className='text-sm'
            loadOptions={
              input => fetchSelectOptions(
                client,
                input,
                PRODUCT_SEARCH_QUERY,
                data =>
                  data?.products.map((product) => ({
                    label: product.name,
                    value: product.slug
                  }))
              )
            }
            onChange={(e) => handleExtendedDataChange('itemSlug', e.value)}
          />
          <span className='text-xs italic'>
            <FormattedMessage id='landing.widget.selected.value' />
            {`: ${item.extendedData?.itemSlug}`}
          </span>
        </div>
      )
    case PinnedItemTypes.PINNED_ORGANIZATION:
      return (
        <div className='form-field-wrapper'>
          <label htmlFor='pinned-item-slug'>
            <FormattedMessage id='landing.pinned.organization' />
          </label>
          <Select
            async
            id='pinned-item-slug'
            borderless
            className='text-sm'
            loadOptions={
              input => fetchSelectOptions(
                client,
                input,
                ORGANIZATION_SEARCH_QUERY,
                data =>
                  data?.organizations.map((organization) => ({
                    label: organization.name,
                    value: organization.slug
                  }))
              )
            }
            onChange={(e) => handleExtendedDataChange('itemSlug', e.value)}
          />
          <span className='text-xs italic'>
            <FormattedMessage id='landing.widget.selected.value' />
            {`: ${item.extendedData?.itemSlug}`}
          </span>
        </div>
      )
    case PinnedItemTypes.PINNED_PROJECT:
      return (
        <div className='form-field-wrapper'>
          <label htmlFor='pinned-item-slug'>
            <FormattedMessage id='landing.pinned.project' />
          </label>
          <Select
            async
            id='pinned-item-slug'
            borderless
            className='text-sm'
            loadOptions={
              input => fetchSelectOptions(
                client,
                input,
                PROJECT_SEARCH_QUERY,
                data =>
                  data?.projects.map((project) => ({
                    label: project.name,
                    value: project.slug
                  }))
              )
            }
            onChange={(e) => handleExtendedDataChange('itemSlug', e.value)}
          />
          <span className='text-xs italic'>
            <FormattedMessage id='landing.widget.selected.value' />
            {`: ${item.extendedData?.itemSlug}`}
          </span>
        </div>
      )
    case PinnedItemTypes.PINNED_USE_CASE:
      return (
        <div className='form-field-wrapper'>
          <label htmlFor='pinned-item-slug'>
            <FormattedMessage id='landing.pinned.useCase' />
          </label>
          <Select
            async
            id='pinned-item-slug'
            borderless
            className='text-sm'
            loadOptions={
              input => fetchSelectOptionsWithMaturity(
                client,
                input,
                USE_CASE_SEARCH_QUERY,
                data =>
                  data?.useCases.map((useCase) => ({
                    label: useCase.name,
                    value: useCase.slug
                  }))
              )
            }
            onChange={(e) => handleExtendedDataChange('itemSlug', e.value)}
          />
          <span className='text-xs italic'>
            <FormattedMessage id='landing.widget.selected.value' />
            {`: ${item.extendedData?.itemSlug}`}
          </span>
        </div>
      )
    default:
      return null
  }
}

const PinnedItem = ({ disabled, itemType, itemSlug }) => {
  const renderItem = (itemType, itemSlug) => {
    switch (itemType) {
      case PinnedItemTypes.PINNED_BUILDING_BLOCK:
        return <PinnedBuildingBlock disabled={disabled} slug={itemSlug} />
      case PinnedItemTypes.PINNED_PRODUCT:
        return <PinnedProduct disabled={disabled} slug={itemSlug} />
      case PinnedItemTypes.PINNED_ORGANIZATION:
        return <PinnedOrganization disabled={disabled} slug={itemSlug} />
      case PinnedItemTypes.PINNED_PROJECT:
        return <PinnedProject disabled={disabled} slug={itemSlug} />
      case PinnedItemTypes.PINNED_USE_CASE:
        return <PinnedUseCase disabled={disabled} slug={itemSlug} />
      default:
        <div className='text-xs italic'>
          <FormattedMessage id='landing.pinned.type.missing' />
        </div>
    }
  }

  return renderItem(itemType, itemSlug)
}

export default PinnedItem
