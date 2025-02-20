import { FormattedMessage } from 'react-intl'
import BuildingBlockListRight from '../../building-block/fragments/BuildingBlockListRight'
import EndorserMap from '../../maps/endorsers/EndorserMap'
import ProjectMap from '../../maps/projects/ProjectMap'
import OrganizationListRight from '../../organization/fragments/OrganizationListRight'
import ProductListRight from '../../product/fragments/ProductListRight'
import ProjectListRight from '../../project/fragments/ProjectListRight'
import UseCaseListRight from '../../use-case/fragments/UseCaseListRight'
import { ContentListTypes, ContentMapTypes } from './constants'

// Update rendered components depending on the selected value.
// This is specific for map widget, we can add more maps in the future.
export const resolveContentMapValue = (value) => {
  switch (value) {
    case ContentMapTypes.PROJECT_MAP:
      return <ProjectMap />
    case ContentMapTypes.ENDORSER_MAP:
      return <EndorserMap />
    default:
      return (
        <div className='text-xs italic'>
          <FormattedMessage id='landing.content.map.missing' />
        </div>
      )
  }
}

// Update rendered components depending on the selected value.
// This is specific for list widget, we can add more maps in the future.
export const resolveContentListValue = (value) => {
  switch (value) {
    case ContentListTypes.PRODUCT_LIST:
      return <ProductListRight />
    case ContentListTypes.ORGANIZATION_LIST:
      return <OrganizationListRight />
    case ContentListTypes.USE_CASE_LIST:
      return <UseCaseListRight />
    case ContentListTypes.BUILDING_BLOCK_LIST:
      return <BuildingBlockListRight />
    case ContentListTypes.PROJECT_LIST:
      return <ProjectListRight />
    default:
      return (
        <div className='text-xs italic'>
          <FormattedMessage id='landing.content.list.missing' />
        </div>
      )
  }
}
