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
      setMenuConfigurations(data.siteSetting.menuConfigurations)
      setCarouselConfigurations(data.siteSetting.carouselConfigurations)
      setHeroCardSection(data.siteSetting.heroCardSection)
      setEnableMarketplace(data.siteSetting.enableMarketplace)
    }
  })

  const [currentStatus, setCurrentStatus] = useState(status === 'authenticated')

  const [exchangeLogoUrl, setExchangeLogoUrl] = useState()
  const [menuConfigurations, setMenuConfigurations] = useState([])
  const [carouselConfigurations, setCarouselConfigurations] = useState([])
  const [heroCardSection, setHeroCardSection] = useState([])

  const [enableMarketplace, setEnableMarketplace] = useState(false)

  const siteSettingValues = {
    exchangeLogoUrl,
    menuConfigurations,
    carouselConfigurations,
    heroCardSection,
    enableMarketplace
  }

  const siteSettingDispatchValues = {
    setExchangeLogoUrl,
    setMenuConfigurations,
    setCarouselConfigurations,
    setHeroCardSection,
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
