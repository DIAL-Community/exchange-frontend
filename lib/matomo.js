export const pageview = (url) => {
  if (window && window._paq) {
    window._paq.push(['setCustomUrl', url])
    window._paq.push(['setDocumentTitle', document.title])
    window._paq.push(['trackPageView'])
  }
}
