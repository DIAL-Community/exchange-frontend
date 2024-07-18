import { gql } from '@apollo/client'

export const DELETE_RESOURCE = gql`
  mutation DeleteResource($id: ID!) {
    deleteResource(id: $id) {
      resource {
        id
        slug
        name
      }
      errors
    }
  }
`

export const CREATE_RESOURCE = gql`
  mutation CreateResource(
    $slug: String!
    $name: String!
    $imageFile: Upload
    $description: String
    $featured: Boolean
    $resourceFile: Upload
    $resourceLink: String
    $linkDescription: String
    $sourceName: String
    $sourceWebsite: String
    $sourceLogoFile: Upload
    $resourceType: String
    $resourceTopics: [String!]
    $showInExchange: Boolean
    $showInWizard: Boolean
    $publishedDate: ISO8601Date!
    $organizationSlug: String
    $authors: [JSON!]
  ) {
    createResource(
      name: $name
      slug: $slug
      imageFile: $imageFile
      description: $description
      featured: $featured
      resourceFile: $resourceFile
      resourceLink: $resourceLink
      linkDescription: $linkDescription
      sourceName: $sourceName
      sourceWebsite: $sourceWebsite
      sourceLogoFile: $sourceLogoFile
      resourceType: $resourceType
      resourceTopics: $resourceTopics
      showInExchange: $showInExchange
      showInWizard: $showInWizard
      publishedDate: $publishedDate
      organizationSlug: $organizationSlug
      authors: $authors
    ) {
      resource {
        id
        name
        slug
        description
        publishedDate

        featured

        resourceFile
        resourceLink
        linkDescription
        
        source {
          id
          name
          slug
          imageFile
        }
        resourceType
        resourceTopics {
          id
          slug
          name
        }

        authors {
          id
          slug
          name
          email
        }
      }
      errors
    }
  }
`

export const UPDATE_RESOURCE_TAGS = gql`
  mutation UpdateResourceTags(
    $slug: String!
    $tagNames: [String!]!
  ) {
    updateResourceTags(
      slug: $slug
      tagNames: $tagNames
    ) {
      resource {
        id
        name
        slug
        tags
      }
      errors
    }
  }
`

export const UPDATE_RESOURCE_COUNTRIES = gql`
  mutation UpdateResourceCountries(
    $slug: String!
    $countrySlugs: [String!]!
  ) {
    updateResourceCountries(
      slug: $slug
      countrySlugs: $countrySlugs
    ) {
      resource {
        id
        slug
        name
        countries {
          id
          name
          slug
          code
        }
      }
      errors
    }
  }
`

export const UPDATE_RESOURCE_PRODUCTS = gql`
  mutation UpdateResourceProducts(
    $slug: String!
    $productSlugs: [String!]!
  ) {
    updateResourceProducts(
      slug: $slug
      productSlugs: $productSlugs
    ) {
      resource {
        id
        slug
        name
        products {
          id
          name
          slug
          imageFile
        }
      }
      errors
    }
  }
`

export const UPDATE_RESOURCE_BUILDING_BLOCKS = gql`
  mutation UpdateResourceBuildingBlocks(
    $slug: String!
    $buildingBlockSlugs: [String!]!
    $mappingStatus: String
  ) {
    updateResourceBuildingBlocks(
      slug: $slug
      buildingBlockSlugs: $buildingBlockSlugs
      mappingStatus: $mappingStatus
    ) {
      resource {
        id
        slug
        name
        buildingBlocks {
          id
          name
          slug
          imageFile
          maturity
        }
        buildingBlocksMappingStatus
      }
      errors
    }
  }
`

export const UPDATE_RESOURCE_USE_CASES = gql`
  mutation UpdateResourceUseCases(
    $slug: String!
    $useCaseSlugs: [String!]!
  ) {
    updateResourceUseCases(
      slug: $slug
      useCaseSlugs: $useCaseSlugs
    ) {
      resource {
        id
        slug
        name
        useCases {
          id
          name
          slug
          imageFile
        }
      }
      errors
    }
  }
`
