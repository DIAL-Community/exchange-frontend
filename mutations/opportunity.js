import { gql } from '@apollo/client'

export const CREATE_OPPORTUNITY = gql`
  mutation CreateOpportunity(
    $slug: String!
    $name: String!
    $imageFile: Upload
    $webAddress: String!
    $description: String!
    $contactName: String!
    $contactEmail: String!
    $openingDate: ISO8601Date!
    $closingDate: ISO8601Date!
    $opportunityType: String!
    $opportunityStatus: String!
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
    ) {
      opportunity {
        slug
        name
        description
        webAddress
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
        countries {
          id
          name
          slug
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
