import { createContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLazyQuery } from '@apollo/client'
import { DEFAULT_SITE_SETTING_DETAIL_QUERY } from '../shared/query/siteSetting'

const SiteSettingContext = createContext()
const SiteSettingDispatchContext = createContext()

const SiteSettingProvider = ({ children }) => {
  const { status } = useSession()
  const [updateSiteSettings, { loading, error }] = useLazyQuery(DEFAULT_SITE_SETTING_DETAIL_QUERY, {
    onCompleted: (data) => {
      setExchangeLogoUrl(data.defaultSiteSetting.exchangeLogoUrl)
      setMenuConfigurations(data.defaultSiteSetting.menuConfigurations)
      setCarouselConfigurations(data.defaultSiteSetting.carouselConfigurations)
      setHeroCardSection(data.defaultSiteSetting.heroCardSection)
      setSiteColors(data.defaultSiteSetting.siteColors)
      setEnableMarketplace(data.defaultSiteSetting.enableMarketplace)
    }
  })

  const [currentStatus, setCurrentStatus] = useState(status === 'authenticated')

  const [exchangeLogoUrl, setExchangeLogoUrl] = useState()
  const [menuConfigurations, setMenuConfigurations] = useState([])
  const [carouselConfigurations, setCarouselConfigurations] = useState([])
  const [heroCardSection, setHeroCardSection] = useState([])
  const [siteColors, setSiteColors] = useState({})

  const [enableMarketplace, setEnableMarketplace] = useState(false)

  const siteSettingValues = {
    exchangeLogoUrl,
    menuConfigurations,
    carouselConfigurations,
    heroCardSection,
    siteColors,
    enableMarketplace
  }

  const siteSettingDispatchValues = {
    setExchangeLogoUrl,
    setMenuConfigurations,
    setCarouselConfigurations,
    setHeroCardSection,
    setSiteColors,
    setEnableMarketplace
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
