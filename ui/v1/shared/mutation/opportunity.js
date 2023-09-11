import { gql } from '@apollo/client'

export const DELETE_OPPORTUNITY = gql`
  mutation DeleteOpportunity($id: ID!) {
    deleteOpportunity(id: $id) {
      opportunity {
       id
       slug
       name
      }
      errors
    }
  }
`

export const CREATE_OPPORTUNITY = gql`
  mutation CreateOpportunity(
    $slug: String!
    $name: String!
    $imageFile: Upload
    $webAddress: String!
    $description: String!
    $contactName: String!
    $contactEmail: String!
    $openingDate: ISO8601Date
    $closingDate: ISO8601Date!
    $opportunityType: String!
    $opportunityStatus: String!
    $opportunityOrigin: String!
  ) {
    createOpportunity(
      slug: $slug
      name: $name
      imageFile: $imageFile
      webAddress: $webAddress
      description: $description
      contactName: $contactName
      contactEmail: $contactEmail
      openingDate: $openingDate
      closingDate: $closingDate
      opportunityType: $opportunityType
      opportunityStatus: $opportunityStatus
      opportunityOrigin: $opportunityOrigin
    ) {
      opportunity {
        id
        slug
        name
        tags
        imageFile
        webAddress
        description
        opportunityStatus
        opportunityType
        closingDate
        openingDate
        contactName
        contactEmail
        origin {
          id
          name
          slug
        }
      }
      errors
    }
  }
`

export const UPDATE_OPPORTUNITY_COUNTRIES = gql`
  mutation UpdateOpportunityCountries(
    $slug: String!
    $countrySlugs: [String!]!
  ) {
    updateOpportunityCountries(
      slug: $slug
      countrySlugs: $countrySlugs
    ) {
      opportunity {
        id
        name
        slug
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

export const UPDATE_OPPORTUNITY_SECTORS = gql`
  mutation UpdateOpportunitySectors(
    $slug: String!
    $sectorSlugs: [String!]!
  ) {
    updateOpportunitySectors(
      slug: $slug
      sectorSlugs: $sectorSlugs
    ) {
      opportunity {
        id
        name
        slug
        sectors {
          id
          name
          slug
        }
      }
      errors
    }
  }
`

export const UPDATE_OPPORTUNITY_ORGANIZATIONS = gql`
  mutation UpdateOpportunityOrganizations(
    $slug: String!
    $organizationSlugs: [String!]!
  ) {
    updateOpportunityOrganizations(
      slug: $slug
      organizationSlugs: $organizationSlugs
    ) {
      opportunity {
        id
        name
        slug
        organizations {
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

export const UPDATE_OPPORTUNITY_USE_CASES = gql`
  mutation UpdateOpportunityUseCases(
    $slug: String!
    $useCaseSlugs: [String!]!
  ) {
    updateOpportunityUseCases(
      slug: $slug
      useCaseSlugs: $useCaseSlugs
    ) {
      opportunity {
        id
        name
        slug
        useCases {
          id
          name
          slug
          imageFile
          maturity
        }
      }
      errors
    }
  }
`

export const UPDATE_OPPORTUNITY_BUILDING_BLOCKS = gql`
  mutation UpdateOpportunityBuildingBlocks(
    $slug: String!
    $buildingBlockSlugs: [String!]!
  ) {
    updateOpportunityBuildingBlocks(
      slug: $slug
      buildingBlockSlugs: $buildingBlockSlugs
    ) {
      opportunity {
        id
        name
        slug
        buildingBlocks {
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

export const UPDATE_OPPORTUNITY_TAGS = gql`
  mutation UpdateOpportunityTags(
    $slug: String!
    $tagNames: [String!]!
  ) {
    updateOpportunityTags(
      slug: $slug
      tagNames: $tagNames
    ) {
      opportunity {
        id
        name
        slug
        tags
      }
      errors
    }
  }
`
