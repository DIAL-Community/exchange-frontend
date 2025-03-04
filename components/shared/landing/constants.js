import { FormattedMessage } from 'react-intl'

export const WidgetTypeOptions = {
  CALLOUT: 'landing.widget.callout',
  CARD: 'landing.widget.card',
  CAROUSEL: 'landing.widget.carousel',
  LIST: 'landing.widget.list',
  MAP: 'landing.widget.map',
  SPACER: 'landing.widget.spacer',
  SUMMARY: 'landing.widget.summary',
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

export const ContentMapTypes = {
  PROJECT_MAP: 'project-map',
  ENDORSER_MAP: 'endorser-map',
  AGGREGATOR_MAP: 'aggregator-map'
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
  }
]
