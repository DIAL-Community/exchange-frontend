import { FormattedMessage } from 'react-intl'

export const WidgetTypeOptions = {
  HERO_CAROUSEL: 'landing.widget.hero.carousel',
  HERO_CARD: 'landing.widget.hero.card',
  CONTENT_MAP: 'landing.widget.content.map',
  CONTENT_LIST: 'landing.widget.content.list',
  TEXT_SUMMARY: 'landing.widget.text.summary',
  TEXT_BLOCK: 'landing.widget.text.block'
}

export const ContentListTypes = {
  PRODUCT_LIST: 'product-list',
  ORGANIZATION_LIST: 'organization-list',
  USE_CASE_LIST: 'use-case-list',
  BUILDING_BLOCK_LIST: 'building-block-list',
  PROJECT_LIST: 'project-list'
}

export const ContentListOptions = [
  {
    label: <FormattedMessage id='landing.content.list.buildingBlocks' />,
    value: ContentListTypes.BUILDING_BLOCK_LIST
  },
  {
    label: <FormattedMessage id='landing.content.list.organizations' />,
    value: ContentListTypes.ORGANIZATION_LIST
  },
  {
    label: <FormattedMessage id='landing.content.list.products' />,
    value: ContentListTypes.PRODUCT_LIST
  },
  {
    label: <FormattedMessage id='landing.content.list.projects' />,
    value: ContentListTypes.PROJECT_LIST
  },
  {
    label: <FormattedMessage id='landing.content.list.useCases' />,
    value: ContentListTypes.USE_CASE_LIST
  }
]

export const ContentMapTypes = {
  PROJECT_MAP: 'project-map',
  ENDORSER_MAP: 'endorser-map'
}

export const ContentMapOptions = [
  {
    label: <FormattedMessage id='landing.content.map.projects' />,
    value: ContentMapTypes.PROJECT_MAP
  },
  {
    label: <FormattedMessage id='landing.content.map.endorsers' />,
    value: ContentMapTypes.ENDORSER_MAP
  }
]
