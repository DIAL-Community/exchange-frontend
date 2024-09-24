import { gql } from '@apollo/client'

export const DELETE_SITE_SETTING = gql`
  mutation DeleteSiteSetting($id: ID!) {
    deleteSiteSetting(id: $id) {
      siteSetting {
       id
       slug
       name
       description
      }
      errors
    }
  }
`

export const CREATE_SITE_SETTING = gql`
  mutation CreateSiteSetting(
    $name: String!
    $slug: String!
    $description: String!
    $defaultSetting: Boolean!
    $enableMarketplace: Boolean!
    $faviconUrl: String!
    $exchangeLogoUrl: String!
    $openGraphLogoUrl: String!
  ) {
    createSiteSetting(
      name: $name
      slug: $slug
      description: $description
      defaultSetting: $defaultSetting
      enableMarketplace: $enableMarketplace
      faviconUrl: $faviconUrl
      exchangeLogoUrl: $exchangeLogoUrl
      openGraphLogoUrl: $openGraphLogoUrl
    ) {
      siteSetting {
        id
        name
        slug
        description
      }
      errors
    }
  }
`

export const UPDATE_SITE_SETTING_MENU_CONFIGURATIONS = gql`
  mutation UpdateSiteSettingMenuConfigurations(
    $siteSettingSlug: String!
    $menuConfigurations: JSON!
  ) {
    updateSiteSettingMenuConfigurations(
      siteSettingSlug: $siteSettingSlug
      menuConfigurations: $menuConfigurations
    ) {
      siteSetting {
        id
        name
        menuConfigurations
      }
      errors
    }
  }
`

export const UPDATE_SITE_SETTING_MENU_CONFIGURATION = gql`
  mutation UpdateSiteSettingMenuConfiguration(
    $siteSettingSlug: String!
    $slug:  String
    $name: String!
    $type: String!
    $external: Boolean
    $destinationUrl: String
    $parentSlug: String
  ) {
    updateSiteSettingMenuConfiguration(
      siteSettingSlug: $siteSettingSlug
      slug: $slug
      name: $name
      type: $type
      external: $external
      destinationUrl: $destinationUrl
      parentSlug: $parentSlug
    ) {
      siteSetting {
        id
        name
        menuConfigurations
      }
      errors
    }
  }
`

export const UPDATE_SITE_SETTING_HERO_CARD_CONFIGURATIONS = gql`
  mutation UpdateSiteSettingHeroCardConfigurations(
    $siteSettingSlug: String!
    $heroCardConfigurations: JSON!
  ) {
    updateSiteSettingHeroCardConfigurations(
      siteSettingSlug: $siteSettingSlug
      heroCardConfigurations: $heroCardConfigurations
    ) {
      siteSetting {
        id
        name
        heroCardConfigurations
      }
      errors
    }
  }
`

export const UPDATE_SITE_SETTING_CAROUSEL_CONFIGURATIONS = gql`
  mutation UpdateSiteSettingCarouselConfigurations(
    $siteSettingSlug: String!
    $carouselConfigurations: JSON!
  ) {
    updateSiteSettingCarouselConfigurations(
      siteSettingSlug: $siteSettingSlug
      carouseConfigurations: $carouseConfigurations
    ) {
      siteSetting {
        id
        name
        carouseConfigurations
      }
      errors
    }
  }
`
