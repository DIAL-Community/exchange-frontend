import { useCallback, useEffect, useState } from 'react'
import { DefaultSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useLazyQuery } from '@apollo/client'
import { INITIAL_IMAGE_URL_QUERY } from '../components/shared/query/siteSetting'

const CatalogSeo = ({ currentTenant }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [faviconUrl, setFaviconUrl] = useState()
  const [openGraphLogoUrl, setOpenGraphLogoUrl] = useState()

  const [updateSeoSettings, { loading, error }] = useLazyQuery(INITIAL_IMAGE_URL_QUERY, {
    onCompleted: (data) => {
      setFaviconUrl(data.defaultSiteSetting.faviconUrl)
      setOpenGraphLogoUrl(data.defaultSiteSetting.openGraphLogoUrl)
    }
  })

  const titleForTenant = (tenantName) => {
    return tenantName !== 'dpi' ? format('app.title') : format('hub.title')
  }

  useEffect(() => {
    if (!openGraphLogoUrl || !faviconUrl) {
      updateSeoSettings()
    }
  }, [faviconUrl, openGraphLogoUrl, updateSeoSettings])

  if (loading || error) return null

  return (
    <DefaultSeo
      titleTemplate={`${titleForTenant(currentTenant)} | %s - ${currentTenant}`}
      defaultTitle={titleForTenant(currentTenant)}
      description={format('wizard.getStarted.firstLine')}
      additionalLinkTags={[{
        rel: 'icon',
        href: `//${faviconUrl}` ?? '/favicon.ico'
      }]}
      openGraph={{
        title: titleForTenant(currentTenant),
        type: 'website',
        images: [
          {
            url: `//${openGraphLogoUrl}` ?? '/ui/v1/hero-dx-bg.svg',
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
