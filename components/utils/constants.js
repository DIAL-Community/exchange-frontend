export const DisplayType = {
  LARGE_CARD: 'large-card',
  SMALL_CARD: 'small-card',
  PINNED_CARD: 'pinned-card',
  FEATURED_CARD: 'featured-card',
  HUB_CARD: 'hub-card',
  GRID_CARD: 'grid-card'
}

export const MainDisplayType = {
  LIST: 'list',
  GRID: 'grid'
}

export const ORIGIN_SLUG_EXPANSIONS = {
  'dial': 'Digital Impact Alliance',
  'digital-government-platform-tracker': 'Digital Government Platform Tracker',
  'digital-health-atlas': 'Digital Health Atlas',
  'digital-square': 'Digital Square',
  'dpga': 'Digital Public Goods Alliance',
  'giz': 'GIZ',
  'indiastack': 'India Stack',
  'manually-entered': 'Manually Entered',
  'unicef-covid': 'UNICEF'
}

export const OpportunityStatus = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  UPCOMING: 'UPCOMING'
}

export const OpportunityType = {
  BID: 'BID',
  BUILDING_BLOCK: 'BUILDING BLOCK',
  INNOVATION: 'INNOVATION',
  TENDER: 'TENDER',
  OTHER: 'OTHER'
}

export const MaturityStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED'
}

export const CategoryType = {
  DPI: 'DPI',
  FUNCTIONAL: 'FUNCTIONAL'
}

export const MappingStatus = {
  BETA: 'BETA',
  MATURE: 'MATURE',
  SELF_REPORTED: 'SELF-REPORTED',
  VALIDATED: 'VALIDATED'
}

export const LicenseTypeFilter = {
  ALL: 'all_license',
  COMMERCIAL: 'commercial_only',
  OPEN_SOURCE:'oss_only'
}

export const ObjectType = {
  BUILDING_BLOCK: 'BUILDING_BLOCK',
  DATASET: 'OPEN_DATA',
  PRODUCT: 'PRODUCT',
  PROJECT: 'PROJECT',
  OPPORTUNITY: 'OPPORTUNITY',
  ORGANIZATION: 'ORGANIZATION',
  USE_CASE: 'USE_CASE',
  WORKFLOW: 'WORKFLOW',
  MOVE: 'MOVE',
  PLAY: 'PLAY',
  PLAYBOOK: 'PLAYBOOK',
  RUBRIC_CATEGORY: 'RUBRIC_CATEGORY',
  CATEGORY_INDICATOR: 'CATEGORY_INDICATOR',
  CANDIDATE_DATASET: 'CANDIDATE_OPEN_DATA',
  CANDIDATE_ORGANIZATION: 'CANDIDATE_ORGANIZATION',
  CANDIDATE_PRODUCT: 'CANDIDATE_PRODUCT',
  CANDIDATE_RESOURCE: 'CANDIDATE_RESOURCE',
  CANDIDATE_ROLE: 'CANDIDATE_ROLE',
  TAG: 'TAG',
  SECTOR: 'SECTOR',
  URL: 'URL',
  CITY: 'CITY',
  COUNTRY: 'COUNTRY',
  REGION: 'REGION',
  TASK: 'TASK',
  USER: 'USER',
  CONTACT: 'CONTACT',
  RESOURCE: 'RESOURCE',
  RESOURCE_TOPIC: 'RESOURCE_TOPIC',
  SITE_SETTING: 'SITE_SETTING',
  TENANT_SETTING: 'TENANT_SETTING'

}

export const CategoryIndicatorType = {
  NUMERIC: 'numeric',
  SCALE: 'scale',
  BOOLEAN: 'boolean'
}

export const CandidateActionType = {
  APPROVE: 'APPROVE',
  REJECT: 'REJECT'
}

export const DEFAULT_PAGE_SIZE = 8

export const ProductStageType = {
  PILOT: 'pilot',
  SCALING: 'scaling',
  MATURE: 'mature'
}

export const ProductExtraAttributeNames = [
  'Relevance',
  'Impact',
  'Local Ownership',
  'Funders'
]

export const ProductMaturityAttributeNames = [
  'Deployments',
  'Deployed Countries',
  'Active Users',
  'Transactions per month',
  'Annual Revenue',
  'Funding Raised'
]
