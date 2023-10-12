import {
  CategoryType,
  LicenseTypeFilter,
  MappingStatus,
  MaturityStatus,
  ORIGIN_SLUG_EXPANSIONS,
  OpportunityStatus,
  OpportunityType
} from '../../utils/constants'

export const generateMaturityOptions = (format) => [
  { label: format('shared.maturity.draft'), value: MaturityStatus.DRAFT },
  { label: format('shared.maturity.published'), value: MaturityStatus.PUBLISHED }
]

export const generateCategoryOptions = (format) => [
  { label: format('buildingBlock.category.dpi'), value: CategoryType.DPI },
  { label: format('buildingBlock.category.functional'), value: CategoryType.FUNCTIONAL }
]

export const generateResourceTypeOptions = (format) => [
  { label: format('ui.resource.type.caseStudy'), value: 'ui.resource.type.caseStudy' },
  { label: format('ui.resource.type.spotlight'), value: 'ui.resource.type.spotlight' },
  { label: format('ui.resource.type.whitepaper'), value: 'ui.resource.type.whitepaper' }
]

export const generateResourceTopicOptions = (format) => [
  { label: format('ui.resource.topic.laws'), value: 'ui.resource.topic.laws' },
  { label: format('ui.resource.topic.oversight'), value: 'ui.resource.topic.oversight' },
  { label: format('ui.resource.topic.participation'), value: 'ui.resource.topic.participation' },
  { label: format('ui.resource.topic.technology'), value: 'ui.resource.topic.technology' }
]

export const generateMappingStatusOptions = (format) => [
  { label: format('shared.mappingStatus.beta'), value: MappingStatus.BETA },
  { label: format('shared.mappingStatus.mature'), value: MappingStatus.MATURE },
  { label: format('shared.mappingStatus.selfReported'), value: MappingStatus.SELF_REPORTED },
  { label: format('shared.mappingStatus.validated'), value: MappingStatus.VALIDATED }
]

export const generateLicenseTypeOptions = (format) => [
  { label: format('licenseType.allType'), value: LicenseTypeFilter.ALL },
  { label: format('licenseType.commercialOnly'), value: LicenseTypeFilter.COMMERCIAL },
  { label: format('licenseType.ossOnly'), value: LicenseTypeFilter.OPEN_SOURCE }
]

export const generateCategoryTypeOptions = (format) => [
  { label: format('buildingBlock.category.dpi'), value: CategoryType.DPI },
  { label: format('buildingBlock.category.functional'), value: CategoryType.FUNCTIONAL }
]

export const generateDatasetTypeOptions = (format) => [
  { label: format('ui.dataset.type.dataset'), value: 'dataset' },
  { label: format('ui.dataset.type.content'), value: 'content' },
  { label: format('ui.dataset.type.standard'), value: 'standard' },
  { label: format('ui.dataset.type.aiModel'), value: 'ai_model' }
]

export const generateLanguageOptions = (format) => [
  { label: format('locale.english.label'), value: 'en' },
  { label: format('locale.german.label'), value: 'de' },
  { label: format('locale.spanish.label'), value: 'es' },
  { label: format('locale.french.label'), value: 'fr' },
  { label: format('locale.portuguese.label'), value: 'pt' },
  { label: format('locale.swahili.label'), value: 'sw' },
  { label: format('locale.czech.label'), value: 'cs' }
]

export const generateOpportunityTypeOptions = (format) => [
  { label: format('ui.opportunity.type.bid'), value: OpportunityType.BID },
  { label: format('ui.opportunity.type.buildingBlock'), value: OpportunityType.BUILDING_BLOCK },
  { label: format('ui.opportunity.type.innovation'), value: OpportunityType.INNOVATION },
  { label: format('ui.opportunity.type.tender'), value: OpportunityType.TENDER },
  { label: format('ui.opportunity.type.other'), value: OpportunityType.OTHER }
]

export const generateOpportunityStatusOptions = (format) => [
  { label: format('ui.opportunity.status.closed'), value: OpportunityStatus.CLOSED },
  { label: format('ui.opportunity.status.open'), value: OpportunityStatus.OPEN },
  { label: format('ui.opportunity.status.upcoming'), value: OpportunityStatus.UPCOMING }
]

export const generateOriginOptions = () => Object.keys(ORIGIN_SLUG_EXPANSIONS).map(key => {
  return { label: ORIGIN_SLUG_EXPANSIONS[key], value: key }
})

export const generateSpecialtyOptions = () => [
  { value: 'AI / Machine Learning', label: 'AI / Machine Learning' },
  { value: 'Data Analytics & Visualization', label: 'Data Analytics & Visualization' },
  { value: 'Mobile Apps', label: 'Mobile Apps' },
  { value: 'SaaS / Hosting Services', label: 'SaaS / Hosting Services' },
  { value: 'UX & Design', label: 'UX & Design' },
  { value: 'Web Development', label: 'Web Development' }
]

export const generateMobileServiceOptions = () => [
  { label: 'Airtime', value: 'Airtime' },
  { label: 'API', value: 'API' },
  { label: 'HS', value: 'HS' },
  { label: 'Mobile-Internet', value: 'Mobile-Internet' },
  { label: 'Mobile-Money', value: 'Mobile-Money' },
  { label: 'Ops-Maintenance', value: 'Ops-Maintenance' },
  { label: 'OTT', value: 'OTT' },
  { label: 'SLA', value: 'SLA' },
  { label: 'SMS', value: 'SMS' },
  { label: 'User-Interface', value: 'User-Interface' },
  { label: 'USSD', value: 'USSD' },
  { label: 'Voice', value: 'Voice' }
]

export const generateCategoryIndicatorTypes = (format) => [
  { label: format('shared.categoryIndicator.type.numeric'), value: 'numeric' },
  { label: format('shared.categoryIndicator.type.scale'), value: 'scale' },
  { label: format('shared.categoryIndicator.type.boolean'), value: 'boolean' }
]
