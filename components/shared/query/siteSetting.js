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
      }
      landingPages {
        id
        slug
        name
        description
        imageUrl
        targetUrl
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
          external
          url
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
