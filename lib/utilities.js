import {
  CategoryType,
  LicenseTypeFilter,
  MaturityStatus,
  OpportunityStatus,
  OpportunityType
} from './constants'

// From: https://stackoverflow.com/a/1199420
export function truncate (str, n, useWordBoundary, ellipsis) {
  if (str.length <= n) { return str }

  const subString = str.substr(0, n - 1)

  return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + (ellipsis ? '...' : '')
}

export const descriptionByLocale = (descriptions, locale, attribute = 'description') => {
  if (descriptions && descriptions.length > 0) {
    // default to the en locale
    const defaultDescription = descriptions.filter(description => {
      return description.locale === 'en' && description[attribute] && description[attribute].trim() !== ''
    }).shift()

    const localeDescription = descriptions.filter(description => {
      return description.locale === locale && description[attribute] && description[attribute].trim() !== ''
    }).shift()

    return localeDescription
      ? localeDescription[attribute]
      : defaultDescription ? defaultDescription[attribute] : undefined
  }

  return undefined
}

export const getMappingStatusOptions = (format) => [
  { label: format('shared.mappingStatus.beta'), value: 'BETA' },
  { label: format('shared.mappingStatus.mature'), value: 'MATURE' },
  { label: format('shared.mappingStatus.selfReported'), value: 'SELF-REPORTED' },
  { label: format('shared.mappingStatus.validated'), value: 'VALIDATED' }
]

export const getMaturityOptions = (format) => [
  { label: format('shared.maturity.draft'), value: MaturityStatus.DRAFT },
  { label: format('shared.maturity.published'), value: MaturityStatus.PUBLISHED }
]

export const getCategoryOptions = (format) => [
  { label: format('buildingBlock.category.dpi'), value: CategoryType.DPI },
  { label: format('buildingBlock.category.functional'), value: CategoryType.FUNCTIONAL }
]

export const getOpportunityStatusBgColor = (opportunity) => {
  const status = opportunity.opportunityStatus
  if (status === OpportunityStatus.CLOSED) return 'bg-red-500'
  if (status === OpportunityStatus.OPEN) return 'bg-emerald-500'
  if (status === OpportunityStatus.UPCOMING) return 'bg-blue-500'
}

export const getOpportunityStatusOptions = (format) => [
  { label: format('opportunity.status.closed'), value: OpportunityStatus.CLOSED },
  { label: format('opportunity.status.open'), value: OpportunityStatus.OPEN },
  { label: format('opportunity.status.upcoming'), value: OpportunityStatus.UPCOMING }
]

export const getOpportunityTypeOptions = (format) => [
  { label: format('opportunity.type.bid'), value: OpportunityType.BID },
  { label: format('opportunity.type.buildingBlock'), value: OpportunityType.BUILDING_BLOCK },
  { label: format('opportunity.type.innovation'), value: OpportunityType.INNOVATION },
  { label: format('opportunity.type.tender'), value: OpportunityType.TENDER },
  { label: format('opportunity.type.other'), value: OpportunityType.OTHER }
]

export const getLanguageOptions = (format) => [
  { label: format('locale.english.label'), value: 'en' },
  { label: format('locale.german.label'), value: 'de' },
  { label: format('locale.spanish.label'), value: 'es' },
  { label: format('locale.french.label'), value: 'fr' },
  { label: format('locale.portuguese.label'), value: 'pt' },
  { label: format('locale.swahili.label'), value: 'sw' },
  { label: format('locale.czech.label'), value: 'cs' }
]

export const getCategoryIndicatorTypes = (format) => [
  { label: format('shared.category-indicator.type.numeric'), value: 'numeric' },
  { label: format('shared.category-indicator.type.scale'), value: 'scale' },
  { label: format('shared.category-indicator.type.boolean'), value: 'boolean' }
]

export const getCategoryIndicatorScaleOptions = (format) => [
  { label: format('shared.category-indicator.type.scale.low'), value: 'low' },
  { label: format('shared.category-indicator.type.scale.medium'), value: 'medium' },
  { label: format('shared.category-indicator.type.scale.high'), value: 'high' }
]

export const getCategoryIndicatorBooleanOptions = (format) => [
  { label: format('shared.category-indicator.type.boolean.true'), value: 't' },
  { label: format('shared.category-indicator.type.boolean.false'), value: 'f' }
]

export const getProductLicenseType = (format) => [
  { label: format('product.license.oss'), value: 'oss' },
  { label: format('product.license.commercial'), value: 'commercial' }
]

export const getCategoryIndicatorNumericOptions = () =>
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(value => ({ label: value, value }))

export const getLicenseTypeOptions = (format) => [
  { value: LicenseTypeFilter.ALL, label: format('licenseType.allType') },
  { value: LicenseTypeFilter.COMMERCIAL, label: format('licenseType.commercialOnly') },
  { value: LicenseTypeFilter.OPEN_SOURCE, label: format('licenseType.ossOnly') }
]

export const prependUrlWithProtocol = (url) => '//' + url

export const getDatasetTypeOptions = (format) => [
  { label: format('dataset.type.dataset'), value: 'dataset' },
  { label: format('dataset.type.content'), value: 'content' },
  { label: format('dataset.type.standard'), value: 'standard' },
  { label: format('dataset.type.aiModel'), value: 'ai_model' }
]

export const getSpecialtyOptions = () => [
  { value: 'AI / Machine Learning', label: 'AI / Machine Learning' },
  { value: 'Data Analytics & Visualization', label: 'Data Analytics & Visualization' },
  { value: 'Mobile Apps', label: 'Mobile Apps' },
  { value: 'SaaS / Hosting Services', label: 'SaaS / Hosting Services' },
  { value: 'UX & Design', label: 'UX & Design' },
  { value: 'Web Development', label: 'Web Development' }
]
