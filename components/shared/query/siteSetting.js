import { gql } from '@apollo/client'

export const SITE_SETTING_POLICY_QUERY = gql`
  query SiteSetting($slug: String) {
    siteSetting(slug: $slug) {
      id
    }
  }
`

export const SITE_SETTING_DETAIL_QUERY = gql`
  query SiteSetting($slug: String) {
    siteSetting(slug: $slug) {
      id
      slug
      name
      description
      faviconUrl
      exchangeLogoUrl
      openGraphLogoUrl
      carouselConfigurations
      menuConfigurations
      heroCardSection
      enableMarketplace
      defaultSetting
      siteColors
    }
  }
`

export const DEFAULT_SITE_SETTING_DETAIL_QUERY = gql`
  query DefaultSiteSetting {
    defaultSiteSetting {
      id
      slug
      name
      description
      faviconUrl
      exchangeLogoUrl
      openGraphLogoUrl
      carouselConfigurations
      menuConfigurations
      heroCardSection
      enableMarketplace
      defaultSetting
      siteColors
    }
  }
`

export const SITE_SETTINGS_QUERY = gql`
  query SiteSettings {
    siteSettings {
      id
      name
      slug
      description
      carouselConfigurations
      menuConfigurations
      heroCardSection
    }
  }
`

export const DEFAULT_SITE_SETTING_ITEM_SETTINGS_QUERY = gql`
  query DefaultSiteSettingLanding {
    defaultSiteSetting {
      id
      slug
      itemLayouts
      itemConfigurations
    }
  }
`

export const INITIAL_IMAGE_URL_QUERY = gql`
  query DefaultSiteSetting {
    defaultSiteSetting {
      id
      slug
      faviconUrl
      openGraphLogoUrl
    }
  }
`

export const SITE_SETTING_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeSiteSetting($search: String) {
    paginationAttributeSiteSetting(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_SITE_SETTINGS_QUERY = gql`
  query PaginatedSiteSettings(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedSiteSettings(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      description
      carouselConfigurations
      menuConfigurations
      heroCardSection
      defaultSetting
    }
  }
`
