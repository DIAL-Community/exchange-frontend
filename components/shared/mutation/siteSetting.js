import { gql } from '@apollo/client'

export const DELETE_SITE_SETTING = gql`
  mutation DeleteSiteSetting($id: ID!) {
    deleteSiteSetting(id: $id) {
      siteSetting {
        id
        slug
        name
        description
        enableMarketplace
        defaultSetting
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
        faviconUrl
        exchangeLogoUrl
        enableMarketplace
        defaultSetting
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
    $id: String!
    $name: String!
    $type: String!
    $external: Boolean
    $destinationUrl: String
    $parentId: String
  ) {
    updateSiteSettingMenuConfiguration(
      siteSettingSlug: $siteSettingSlug
      id: $id
      name: $name
      type: $type
      external: $external
      destinationUrl: $destinationUrl
      parentId: $parentId
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

export const UPDATE_SITE_SETTING_HERO_CARD_SECTION = gql`
  mutation UpdateSiteSettingHeroCardSection(
    $siteSettingSlug: String!
    $title: String
    $description: String
    $wysiwygDescription: String
    $heroCardConfigurations: JSON!
  ) {
    updateSiteSettingHeroCardSection(
      siteSettingSlug: $siteSettingSlug
      title: $title
      description: $description
      wysiwygDescription: $wysiwygDescription
      heroCardConfigurations: $heroCardConfigurations
    ) {
      siteSetting {
        id
        name
        heroCardSection
      }
      errors
    }
  }
`

export const UPDATE_SITE_SETTING_HERO_CARD_CONFIGURATION = gql`
  mutation UpdateSiteSettingHeroCardConfiguration(
    $siteSettingSlug: String!
    $id: String!
    $name: String!
    $type: String!
    $title: String!
    $imageUrl: String!
    $external: Boolean!
    $description: String!
    $destinationUrl: String!
  ) {
    updateSiteSettingHeroCardConfiguration(
      siteSettingSlug: $siteSettingSlug
      id: $id
      name: $name
      type: $type
      title: $title
      imageUrl: $imageUrl
      external: $external
      description: $description
      destinationUrl: $destinationUrl
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

export const UPDATE_SITE_SETTING_CAROUSEL_CONFIGURATIONS = gql`
  mutation UpdateSiteSettingCarouselConfigurations(
    $siteSettingSlug: String!
    $carouselConfigurations: JSON!
  ) {
    updateSiteSettingCarouselConfigurations(
      siteSettingSlug: $siteSettingSlug
      carouselConfigurations: $carouselConfigurations
    ) {
      siteSetting {
        id
        name
        carouselConfigurations
      }
      errors
    }
  }
`

export const UPDATE_SITE_SETTING_CAROUSEL_CONFIGURATION = gql`
  mutation UpdateSiteSettingCarouselConfiguration(
    $siteSettingSlug: String!
    $id: String!
    $name: String!
    $type: String!
    $title: String!
    $imageUrl: String!
    $external: Boolean!
    $description: String!
    $destinationUrl: String!
    $calloutTitle: String!
    $style: String!
  ) {
    updateSiteSettingCarouselConfiguration(
      siteSettingSlug: $siteSettingSlug
      id: $id
      name: $name
      type: $type
      title: $title
      imageUrl: $imageUrl
      external: $external
      description: $description
      destinationUrl: $destinationUrl
      calloutTitle: $calloutTitle
      style: $style
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

export const UPDATE_SITE_SETTING_ITEM_LAYOUTS = gql`
  mutation UpdateSiteSettingItemLayouts(
    $siteSettingSlug: String!
    $itemLayouts: JSON!
  ) {
    updateSiteSettingItemLayouts(
      siteSettingSlug: $siteSettingSlug
      itemLayouts: $itemLayouts
    ) {
      siteSetting {
        id
        name
        itemLayouts
      }
      errors
    }
  }
`

export const UPDATE_SITE_SETTING_ITEM_CONFIGURATIONS = gql`
  mutation UpdateSiteSettingItemConfigurations(
    $siteSettingSlug: String!
    $itemConfigurations: JSON!
  ) {
    updateSiteSettingItemConfigurations(
      siteSettingSlug: $siteSettingSlug
      itemConfigurations: $itemConfigurations
    ) {
      siteSetting {
        id
        name
        itemConfigurations
      }
      errors
    }
  }
`
