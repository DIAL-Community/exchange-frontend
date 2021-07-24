export const GOOGLE_ANALYTIC_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  if (window && window.gtag) {
    window.gtag('config', GOOGLE_ANALYTIC_ID, {
      page_path: url
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  if (window && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      non_interaction: true
    })
  }
}
