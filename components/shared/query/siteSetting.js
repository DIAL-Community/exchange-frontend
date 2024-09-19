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
      heroCards {
        id
        slug
        name
        description
        imageUrl
        targetUrl
        external
      }
      menus {
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
