import { CategoryType, LicenseTypeFilter, MappingStatus, MaturityStatus } from '../../utils/constants'

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
  { label: format('dataset.type.dataset'), value: 'dataset' },
  { label: format('dataset.type.content'), value: 'content' },
  { label: format('dataset.type.standard'), value: 'standard' },
  { label: format('dataset.type.aiModel'), value: 'ai_model' }
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
