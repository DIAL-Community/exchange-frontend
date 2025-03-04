import { FormattedMessage } from 'react-intl'
import { fetchSelectOptions } from '../../../utils/search'
import Select from '../../form/Select'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../query/buildingBlock'
import { PRODUCT_SEARCH_QUERY } from '../../query/product'
import { PinnedItemTypes } from '../constants'
import PinnedBuildingBlock from './PinnedBuildingBlock'
import PinnedProduct from './PinnedProduct'

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
      default:
        <div className='text-xs italic'>
          <FormattedMessage id='landing.pinned.type.missing' />
        </div>
    }
  }

  return renderItem(itemType, itemSlug)
}

export default PinnedItem
