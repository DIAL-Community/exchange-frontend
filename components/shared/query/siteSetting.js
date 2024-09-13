import { gql } from '@apollo/client'

export const SITE_SETTING_QUERY = gql`
  query SiteSetting {
    siteSetting {
      id
      logoUrl
      faviconUrl
      carousels
      landingPages
      dropdownMenus
    }
  }
`
