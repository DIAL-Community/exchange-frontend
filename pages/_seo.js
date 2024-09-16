import { useCallback } from 'react'
import { DefaultSeo } from 'next-seo'
import { useIntl } from 'react-intl'

const CatalogSeo = ({ currentTenant }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const titleForTenant = (tenantName) => {
    return tenantName !== 'dpi' ? format('app.title') : format('hub.title')
  }

  const imageForTenant = (tenantName) => {
    return tenantName !== 'dpi'
      ? 'https://exchange.dial.global/images/hero-image/exchange-hero.png'
      : 'https://exchange.dial.global/images/hero-image/hub-hero.png'
  }

  return (
    <DefaultSeo
      titleTemplate={`${titleForTenant(currentTenant)} | %s - ${currentTenant}`}
      defaultTitle={titleForTenant(currentTenant)}
      description={format('wizard.getStarted.firstLine')}
      additionalLinkTags={[{
        rel: 'icon',
        href: '/favicon.ico'
      }]}
      openGraph={{
        title: titleForTenant(currentTenant),
        type: 'website',
        images: [
          {
            url: imageForTenant(currentTenant),
            width: 700,
            height: 380,
            alt: `Banner of ${titleForTenant(currentTenant)}`
          }
        ]
      }}
      twitter={{
        cardType: 'summary_large_image'
      }}
    />
  )
}

export default CatalogSeo
