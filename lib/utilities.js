
// From: https://stackoverflow.com/a/1199420
export function truncate (str, n, useWordBoundary) {
  if (str.length <= n) { return str }
  const subString = str.substr(0, n - 1)
  return (useWordBoundary
    ? subString.substr(0, subString.lastIndexOf(' '))
    : subString) + ' ...'
}

export const ORIGIN_ACRONYMS = {
  dial_osc: 'dial',
  digital_square: 'ds',
  dpga: 'dpga'
}

export const ORIGIN_EXPANSIONS = {
  dial_osc: 'Digital Impact Alliance Open Source Center',
  digital_square: 'Digital Square',
  dpga: 'Digital Public Goods Alliance'
}
