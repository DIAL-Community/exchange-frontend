
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

export const descriptionByLocale = (descriptions, locale) => {
  if (descriptions && descriptions.length > 0) {
    // default to the en locale
    const defaultDescription = descriptions.filter(description => {
      return description.locale === 'en' && description.description && description.description.trim() !== ''
    }).shift()

    const localeDescription = descriptions.filter(description => {
      return description.locale === locale && description.description && description.description.trim() !== ''
    }).shift()

    return localeDescription
      ? localeDescription.description
      : defaultDescription ? defaultDescription.description : undefined
  }

  return undefined
}
