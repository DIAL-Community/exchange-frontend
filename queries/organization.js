import { gql } from '@apollo/client'

export const ORGANIZATION_SEARCH_QUERY = gql`
  query Organizations($search: String!, $aggregatorOnly: Boolean) {
    organizations(search: $search, aggregatorOnly: $aggregatorOnly) {
      id
      name
      slug
      website
    }
  }
`

export const ORGANIZATION_QUERY = gql`
  query Organization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      isMni
      website
      imageFile
      whenEndorsed
      endorserLevel
      organizationDescription {
        description
        locale
      }
      offices {
        id
        name
        city
        region
        country {
          codeLonger
        }
        latitude
        longitude
      }
      sectors {
        name
        slug
      }
      countries {
        id
        name
        slug
      }
      products {
        id
        slug
        name
        imageFile
      }
      projects {
        name
        slug
        origin {
          slug
        }
      }
      contacts {
        name
        email
        title
      }
    }
  }
`
