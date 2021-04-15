
// From: https://stackoverflow.com/a/1199420
export function truncate (str, n, useWordBoundary) {
  if (str.length <= n) { return str }
  const subString = str.substr(0, n - 1)
  return (useWordBoundary
    ? subString.substr(0, subString.lastIndexOf(' '))
    : subString) + ' ...'
}

export const ORIGIN_ACRONYMS = {
  'dial osc': 'dial',
  'digital square': 'ds',
  unicef: 'dpga'
}

export const ORIGIN_EXPANSIONS = {
  'dial osc': 'Digital Impact Alliance Open Source Center',
  'digital square': 'Digital Square',
  unicef: 'Digital Public Goods Alliance'
}
