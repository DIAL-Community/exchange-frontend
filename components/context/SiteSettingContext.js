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
      setHeroCardSection(data.defaultSiteSetting.heroCardSection)
      setMenuConfigurations(data.defaultSiteSetting.menuConfigurations)
      setSectionConfigurations(data.defaultSiteSetting.sectionConfigurations)
      setCarouselConfigurations(data.defaultSiteSetting.carouselConfigurations)
      setSiteColors(data.defaultSiteSetting.siteColors)
      setEnableMarketplace(data.defaultSiteSetting.enableMarketplace)
    }
  })

  const [currentStatus, setCurrentStatus] = useState(status === 'authenticated')

  const [exchangeLogoUrl, setExchangeLogoUrl] = useState()
  const [heroCardSection, setHeroCardSection] = useState([])
  const [menuConfigurations, setMenuConfigurations] = useState([])
  const [sectionConfigurations, setSectionConfigurations] = useState({})
  const [carouselConfigurations, setCarouselConfigurations] = useState([])

  const [siteColors, setSiteColors] = useState({})
  const [enableMarketplace, setEnableMarketplace] = useState(false)

  const siteSettingValues = {
    exchangeLogoUrl,
    heroCardSection,
    menuConfigurations,
    sectionConfigurations,
    carouselConfigurations,
    siteColors,
    enableMarketplace
  }

  const siteSettingDispatchValues = {
    setExchangeLogoUrl,
    setHeroCardSection,
    setMenuConfigurations,
    setSectionConfigurations,
    setCarouselConfigurations,
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
  SiteSettingContext,
  SiteSettingProvider,
  SiteSettingDispatchContext
}
