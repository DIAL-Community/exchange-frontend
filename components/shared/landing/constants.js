import { FormattedMessage } from 'react-intl'

export const WidgetTypeOptions = {
  CALLOUT: 'landing.widget.callout',
  CARD: 'landing.widget.card',
  CAROUSEL: 'landing.widget.carousel',
  LIST: 'landing.widget.list',
  MAP: 'landing.widget.map',
  PINNED: 'landing.widget.pinned',
  SPACER: 'landing.widget.spacer',
  // SUMMARY: 'landing.widget.summary',
  TEXT: 'landing.widget.text'
}

export const ContentListTypes = {
  PRODUCT_LIST: 'product-list',
  ORGANIZATION_LIST: 'organization-list',
  USE_CASE_LIST: 'use-case-list',
  BUILDING_BLOCK_LIST: 'building-block-list',
  PROJECT_LIST: 'project-list'
}

export const listOptions = [
  {
    label: <FormattedMessage id='landing.list.buildingBlocks' />,
    value: ContentListTypes.BUILDING_BLOCK_LIST
  },
  {
    label: <FormattedMessage id='landing.list.organizations' />,
    value: ContentListTypes.ORGANIZATION_LIST
  },
  {
    label: <FormattedMessage id='landing.list.products' />,
    value: ContentListTypes.PRODUCT_LIST
  },
  {
    label: <FormattedMessage id='landing.list.projects' />,
    value: ContentListTypes.PROJECT_LIST
  },
  {
    label: <FormattedMessage id='landing.list.useCases' />,
    value: ContentListTypes.USE_CASE_LIST
  }
]

export const PinnedItemTypes = {
  PINNED_BUILDING_BLOCK: 'pinned-building-block',
  PINNED_ORGANIZATION: 'pinned-organization',
  PINNED_PRODUCT: 'pinned-product',
  PINNED_PROJECT: 'pinned-project',
  PINNED_USE_CASE: 'pinned-use-case'
}

export const pinnedItemOptions = [
  {
    label: <FormattedMessage id='landing.pinned.buildingBlock' />,
    value: PinnedItemTypes.PINNED_BUILDING_BLOCK
  },
  {
    label: <FormattedMessage id='landing.pinned.organization' />,
    value: PinnedItemTypes.PINNED_ORGANIZATION
  },
  {
    label: <FormattedMessage id='landing.pinned.product' />,
    value: PinnedItemTypes.PINNED_PRODUCT
  },
  {
    label: <FormattedMessage id='landing.pinned.project' />,
    value: PinnedItemTypes.PINNED_PROJECT
  },
  {
    label: <FormattedMessage id='landing.pinned.useCase' />,
    value: PinnedItemTypes.PINNED_USE_CASE
  }
]

export const ContentMapTypes = {
  PROJECT_MAP: 'project-map',
  ENDORSER_MAP: 'endorser-map',
  AGGREGATOR_MAP: 'aggregator-map',
  COUNTRY_MAP: 'country-map'
}

export const mapOptions = [
  {
    label: <FormattedMessage id='landing.map.aggregator' />,
    value: ContentMapTypes.AGGREGATOR_MAP
  },
  {
    label: <FormattedMessage id='landing.map.endorsers' />,
    value: ContentMapTypes.ENDORSER_MAP
  },
  {
    label: <FormattedMessage id='landing.map.projects' />,
    value: ContentMapTypes.PROJECT_MAP
  },
  {
    label: <FormattedMessage id='landing.map.country' />,
    value: ContentMapTypes.COUNTRY_MAP
  }
]
