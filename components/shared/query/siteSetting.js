import { gql } from '@apollo/client'

export const SITE_SETTING_QUERY = gql`
  query SiteSetting {
    siteSetting {
      id
      exchangeLogoUrl
      carousels {
        id
        slug
        name
        description
        imageUrl
        targetUrl
        external
      }
      landingPages {
        id
        slug
        name
        description
        imageUrl
        targetUrl
        external
      }
      dropdownMenus {
        id
        type
        slug
        name
        menuItems {
          id
          type
          slug
          name
          targetUrl
          external
        }
      }
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
