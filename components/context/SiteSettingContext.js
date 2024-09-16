import { createContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLazyQuery } from '@apollo/client'
import { SITE_SETTING_QUERY } from '../shared/query/siteSetting'

const SiteSettingContext = createContext()

const SiteSettingProvider = ({ children }) => {
  const { status } = useSession()
  const [updateSiteSettings, { loading, error }] = useLazyQuery(SITE_SETTING_QUERY, {
    onCompleted: (data) => {
      setExchangeLogoUrl(data.siteSetting.exchangeLogoUrl)
      setMenuConfigurations(data.siteSetting.dropdownMenus)
      setLandingPageConfigurations(data.siteSetting.landingPages)
      setHeroCarouselConfigurations(data.siteSetting.carousels)
    }
  })

  const [currentStatus, setCurrentStatus] = useState(status === 'authenticated')

  const [exchangeLogoUrl, setExchangeLogoUrl] = useState()
  const [menuConfigurations, setMenuConfigurations] = useState([])
  const [landingPageConfigurations, setLandingPageConfigurations] = useState([])
  const [heroCarouselConfigurations, setHeroCarouselConfigurations] = useState([])

  const siteSettingValues = {
    exchangeLogoUrl,
    menuConfigurations,
    landingPageConfigurations,
    heroCarouselConfigurations
  }

  useEffect(() => {
    if (status !== currentStatus) {
      setCurrentStatus(status)
      updateSiteSettings()
    }
  }, [status, currentStatus, updateSiteSettings])

  if (loading || error) return null

  return (
    <SiteSettingContext.Provider value={siteSettingValues}>
      {children}
    </SiteSettingContext.Provider>
  )
}

export {
  SiteSettingProvider,
  SiteSettingContext
}
