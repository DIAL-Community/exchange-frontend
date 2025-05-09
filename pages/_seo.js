import { useCallback, useEffect, useState } from 'react'
import { DefaultSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { INITIAL_IMAGE_URL_QUERY } from '../components/shared/query/siteSetting'

const CatalogSeo = ({ currentTenant }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [faviconUrl, setFaviconUrl] = useState()
  const [openGraphLogoUrl, setOpenGraphLogoUrl] = useState()

  const { loading, error, refetch } = useQuery(INITIAL_IMAGE_URL_QUERY, {
    onCompleted: (data) => {
      setFaviconUrl(data.defaultSiteSetting.faviconUrl)
      setOpenGraphLogoUrl(data.defaultSiteSetting.openGraphLogoUrl)
    }
  })

  const titleForTenant = (tenantName) => {
    switch (tenantName) {
      case 'dpi':
        return format('hub.title')
      case 'health':
        return format('health.title')
      default:
        return format('app.title')
    }
  }

  useEffect(() => {
    if (!openGraphLogoUrl || !faviconUrl) {
      refetch()
    }
  }, [faviconUrl, openGraphLogoUrl, refetch])

  if (loading || error) return null

  return (
    <DefaultSeo
      titleTemplate={`${titleForTenant(currentTenant)} | %s - ${currentTenant}`}
      defaultTitle={titleForTenant(currentTenant)}
      description={format('wizard.getStarted.firstLine')}
      additionalLinkTags={[{
        rel: 'icon',
        href: faviconUrl ? `//${faviconUrl}` : '/favicon.ico'
      }]}
      openGraph={{
        title: titleForTenant(currentTenant),
        type: 'website',
        images: [
          {
            url: openGraphLogoUrl ? `//${openGraphLogoUrl}` : '/ui/v1/hero-dx-bg.svg',
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
