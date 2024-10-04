import { gql } from '@apollo/client'

export const ORGANIZATION_SEARCH_QUERY = gql`
  query Organizations($search: String, $aggregatorOnly: Boolean) {
    organizations(search: $search, aggregatorOnly: $aggregatorOnly) {
      id
      name
      slug
      website
    }
  }
`

export const ORGANIZATION_CONTACT_QUERY = gql`
  query OrganizationOwners($slug: String!, $type: String!, $captcha: String!) {
    owners(slug: $slug, type: $type, captcha: $captcha) {
      email
    }
  }
`

export const ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeOrganization(
    $aggregatorOnly: Boolean
    $endorserOnly: Boolean
    $sectors: [String!]
    $countries: [String!]
    $years: [Int!]
    $search: String
  ) {
    paginationAttributeOrganization(
      aggregatorOnly: $aggregatorOnly
      endorserOnly: $endorserOnly
      sectors: $sectors
      countries: $countries
      years: $years
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_ORGANIZATIONS_QUERY = gql`
  query PaginatedOrganizations(
    $aggregatorOnly: Boolean
    $endorserOnly: Boolean
    $sectors: [String!]
    $countries: [String!]
    $years: [Int!]
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedOrganizations(
      aggregatorOnly: $aggregatorOnly
      endorserOnly: $endorserOnly
      sectors: $sectors
      countries: $countries
      years: $years
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      imageFile
      parsedDescription
      organizationDescription {
        id
        description
        locale
      }
      sectors {
        id
      }
      countries {
        id
      }
      projects {
        id
      }
    }
  }
`

export const STOREFRONT_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeStorefront(
    $sectors: [String!]
    $countries: [String!]
    $buildingBlocks: [String!]
    $specialties: [String!]
    $certifications: [String!]
    $search: String!
  ) {
    paginationAttributeStorefront(
      sectors: $sectors
      countries: $countries
      buildingBlocks: $buildingBlocks
      specialties: $specialties
      certifications: $certifications
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_STOREFRONTS_QUERY = gql`
  query PaginatedStorefronts(
    $sectors: [String!]
    $countries: [String!]
    $buildingBlocks: [String!]
    $specialties: [String!]
    $certifications: [String!]
    $search: String!
    $limit: Int!
    $offset: Int!
  ) {
    paginatedStorefronts(
      sectors: $sectors
      countries: $countries
      buildingBlocks: $buildingBlocks
      specialties: $specialties
      certifications: $certifications
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      imageFile
      parsedDescription
      organizationDescription {
        id
        description
        locale
      }
      sectors {
        id
      }
      countries {
        id
      }
      projects {
        id
      }
    }
  }
`

export const ORGANIZATION_DETAIL_QUERY = gql`
  query Organization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      isMni
      website
      aliases
      imageFile
      isEndorser
      whenEndorsed
      endorserLevel
      hasStorefront
      haveOwner
      organizationDescription {
        id
        description
        locale
      }
      offices {
        id
        name
        slug
        province {
          id
          name
        }
        country {
          id
          name
          code
          codeLonger
        }
        cityData {
          id
          name
          slug
        }
        latitude
        longitude
      }
      sectors {
        id
        name
        slug
      }
      countries {
        id
        name
        slug
        code
      }
      products {
        id
        slug
        name
        imageFile
      }
      projects {
        id
        name
        slug
        organizations {
          id
          name
          slug
          imageFile
        }
        products {
          id
          name
          slug
          imageFile
        }
        origin {
          id
          slug
          name
        }
      }
      contacts {
        id
        name
        slug
        email
        title
      }
    }
  }
`

export const STOREFRONT_DETAIL_QUERY = gql`
  query Organization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      website
      imageFile
      specialties
      hasStorefront
      heroFile
      organizationDescription {
        id
        description
        locale
      }
      offices {
        id
        name
        slug
        province {
          id
          name
        }
        country {
          id
          name
          code
          codeLonger
        }
        cityData {
          id
          name
          slug
        }
        latitude
        longitude
      }
      buildingBlockCertifications {
        id
        name
        slug
        imageFile
        category
        maturity
      }
      productCertifications {
        id
        name
        slug
        imageFile
      }
      sectors {
        id
        name
        slug
      }
      countries {
        id
        name
        slug
        code
      }
      projects {
        id
        name
        slug
        organizations {
          id
          name
          slug
          imageFile
        }
        products {
          id
          name
          slug
          imageFile
        }
        origin {
          slug
          name
        }
      }
      contacts {
        id
        name
        email
        title
      }
      resources {
        id
        name
        slug
        resourceLink
      }
    }
  }
`
