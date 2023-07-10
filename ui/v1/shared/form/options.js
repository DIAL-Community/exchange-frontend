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
  { value: LicenseTypeFilter.ALL, label: format('licenseType.allType') },
  { value: LicenseTypeFilter.COMMERCIAL, label: format('licenseType.commercialOnly') },
  { value: LicenseTypeFilter.OPEN_SOURCE, label: format('licenseType.ossOnly') }
]
