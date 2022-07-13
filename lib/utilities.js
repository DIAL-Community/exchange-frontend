
// From: https://stackoverflow.com/a/1199420
export function truncate (str, n, useWordBoundary, ellipsis) {
  if (str.length <= n) { return str }

  const subString = str.substr(0, n - 1)

  return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + (ellipsis ? '...' : '')
}

export const ORIGIN_ACRONYMS = {
  dial_osc: 'dial',
  digital_square: 'ds',
  digital_health_atlas: 'dha',
  unicef_covid: 'uc',
  manually_entered: 'me',
  digital_government_platform_trac: 'dgpt'

}

export const ORIGIN_EXPANSIONS = {
  dial_osc: 'Digital Impact Alliance Open Source Center',
  digital_square: 'Digital Square',
  dpga: 'Digital Public Goods Alliance'
}

export const asyncSelectStyles = {
  option: (provided) => ({
    ...provided,
    cursor: 'pointer'
  }),
  menuPortal: provided => ({ ...provided, zIndex: 20 }),
  menu: provided => ({ ...provided, zIndex: 20 })
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
  { label: format('shared.maturity.beta'), value: 'BETA' },
  { label: format('shared.maturity.published'), value: 'PUBLISHED' }
]
