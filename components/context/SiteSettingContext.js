import { createContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLazyQuery } from '@apollo/client'
import { SITE_SETTING_DETAIL_QUERY } from '../shared/query/siteSetting'

const SiteSettingContext = createContext()
const SiteSettingDispatchContext = createContext()

const SiteSettingProvider = ({ children }) => {
  const { status } = useSession()
  const [updateSiteSettings, { loading, error }] = useLazyQuery(SITE_SETTING_DETAIL_QUERY, {
    onCompleted: (data) => {
      setExchangeLogoUrl(data.siteSetting.exchangeLogoUrl)
      setHeroCarouselConfigurations(data.siteSetting.carouselConfigurations)
      setHeroCardConfigurations(data.siteSetting.heroCardConfigurations)
      setMenuConfigurations(data.siteSetting.menuConfigurations)
    }
  })

  const [currentStatus, setCurrentStatus] = useState(status === 'authenticated')

  const [exchangeLogoUrl, setExchangeLogoUrl] = useState()
  const [menuConfigurations, setMenuConfigurations] = useState([])
  const [heroCardConfigurations, setHeroCardConfigurations] = useState([])
  const [heroCarouselConfigurations, setHeroCarouselConfigurations] = useState([])

  const siteSettingValues = {
    exchangeLogoUrl,
    menuConfigurations,
    heroCardConfigurations,
    heroCarouselConfigurations
  }

  const siteSettingDispatchValues = {
    setExchangeLogoUrl,
    setMenuConfigurations,
    setHeroCardConfigurations,
    setHeroCarouselConfigurations
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
      <SiteSettingDispatchContext.Provider value={siteSettingDispatchValues}>
        {children}
      </SiteSettingDispatchContext.Provider>
    </SiteSettingContext.Provider>
  )
}

export {
  SiteSettingProvider,
  SiteSettingContext,
  SiteSettingDispatchContext
}
