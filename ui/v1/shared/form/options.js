import {
  CategoryType,
  LicenseTypeFilter,
  MappingStatus,
  MaturityStatus,
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

export const generateSpecialtyOptions = () => [
  { value: 'AI / Machine Learning', label: 'AI / Machine Learning' },
  { value: 'Data Analytics & Visualization', label: 'Data Analytics & Visualization' },
  { value: 'Mobile Apps', label: 'Mobile Apps' },
  { value: 'SaaS / Hosting Services', label: 'SaaS / Hosting Services' },
  { value: 'UX & Design', label: 'UX & Design' },
  { value: 'Web Development', label: 'Web Development' }
]
