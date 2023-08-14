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
    $sectors: [String!]
    $search: String
  ) {
    paginationAttributeOrganization(
      sectors: $sectors
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_ORGANIZATIONS_QUERY = gql`
  query PaginatedOrganizations(
    $sectors: [String!]
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedOrganizations(
      sectors: $sectors
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
