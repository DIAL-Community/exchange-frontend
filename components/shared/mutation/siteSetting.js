import { gql } from '@apollo/client'

export const UPDATE_SITE_SETTING_MENU_CONFIGURATION = gql`
  mutation UpdateSiteSettingMenus(
    $slug: String!
    $menuConfigurations: JSON!
  ) {
    updateSiteSettingMenus(
      slug: $slug
      menuConfigurations: $menuConfigurations
    ) {
      siteSetting {
        id
        name
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
      errors
    }
  }
`
