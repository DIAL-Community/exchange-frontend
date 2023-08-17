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
    $aggregatorOnly: Boolean,
    $endorserOnly: Boolean,
    $sectors: [String!],
    $countries: [String!],
    $years: [Int!],
    $search: String
  ) {
    paginationAttributeOrganization(
      aggregatorOnly: $aggregatorOnly,
      endorserOnly: $endorserOnly,
      sectors: $sectors,
      countries: $countries,
      years: $years,
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_ORGANIZATIONS_QUERY = gql`
  query PaginatedOrganizations(
    $aggregatorOnly: Boolean,
    $endorserOnly: Boolean,
    $sectors: [String!],
    $countries: [String!],
    $years: [Int!],
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedOrganizations(
      aggregatorOnly: $aggregatorOnly,
      endorserOnly: $endorserOnly,
      sectors: $sectors,
      countries: $countries,
      years: $years,
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      imageFile
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
      heroFile
      imageFile
      isEndorser
      whenEndorsed
      endorserLevel
      specialties
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
        region
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
      resources {
        id
        name
        slug
        link
      }
    }
  }
`
