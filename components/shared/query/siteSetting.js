import { gql } from '@apollo/client'

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
      heroCardConfigurations
      menuConfigurations
    }
  }
`

export const SITE_SETTINGS_QUERY = gql`
  query SiteSettings {
    siteSettings {
      id
      name
      description
    }
  }
`

export const INITIAL_IMAGE_URL_QUERY = gql`
  query SiteSetting {
    siteSetting {
      id
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
    }
  }
`
