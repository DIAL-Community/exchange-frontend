import { FormattedMessage } from 'react-intl'
import BuildingBlockListRight from '../../building-block/fragments/BuildingBlockListRight'
import AggregatorMap from '../../maps/aggregators/AggregatorMap'
import EndorserMap from '../../maps/endorsers/EndorserMap'
import ProjectMap from '../../maps/projects/ProjectMap'
import OrganizationListRight from '../../organization/fragments/OrganizationListRight'
import ProductListRight from '../../product/fragments/ProductListRight'
import ProjectListRight from '../../project/fragments/ProjectListRight'
import UseCaseListRight from '../../use-case/fragments/UseCaseListRight'
import { isDebugLoggingEnabled } from '../../utils/utilities'
import { ContentListTypes, ContentMapTypes } from './constants'

export const getFromLocalStorage = (localStorageKey) => {
  if (isDebugLoggingEnabled()) {
    console.log(`Reading '${localStorageKey}' data from local storage.`)
  }

  let localStorage
  if (global.localStorage) {
    try {
      localStorage = JSON.parse(global.localStorage.getItem(localStorageKey))
    } catch (e) {
      console.log('Unable to load layout information from local storage.', e)
    }
  }

  return localStorage
}

export const saveToLocalStorage = (localStorageKey, value) => {
  if (isDebugLoggingEnabled()) {
    console.log(`Saving '${localStorageKey}' data to local storage.`)
  }

  if (global.localStorage) {
    global.localStorage.setItem(localStorageKey, JSON.stringify(value))
  }
}

// Update rendered components depending on the selected value.
// This is specific for map widget, we can add more maps in the future.
export const resolveContentMapValue = (value, country) => {
  switch (value) {
    case ContentMapTypes.PROJECT_MAP:
      return country ? <ProjectMap initialCountry={country} /> : <ProjectMap />
    case ContentMapTypes.ENDORSER_MAP:
      return <EndorserMap />
    case ContentMapTypes.AGGREGATOR_MAP:
      return <AggregatorMap />
    default:
      return (
        <div className='text-xs italic'>
          <FormattedMessage id='landing.map.missing' />
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
          <FormattedMessage id='landing.list.missing' />
        </div>
      )
  }
}
