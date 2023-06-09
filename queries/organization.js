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
      specialties
      organizationDescription {
        id
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
        id
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
        id
        name
        slug
        origin {
          slug
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
        link
      }
    }
  }
`
