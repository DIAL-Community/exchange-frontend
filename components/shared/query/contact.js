import { gql } from '@apollo/client'

export const CONTACT_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeContact($search: String) {
    paginationAttributeContact(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_CONTACTS_QUERY = gql`
  query PaginatedContacts(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedContacts(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      email
      title
      organizations {
        id
      }
    }
  }
`

export const CONTACT_DETAIL_QUERY = gql`
  query Contact($slug: String!) {
    contact(slug: $slug) {
      id
      name
      slug
      email
      title
      organizations {
        id
        name
        slug
        imageFile
      }
    }
  }
`

export const ADLI_CONTACT_DETAIL_QUERY = gql`
  query ContactByEmail($slug: String!, $source: String) {
    contactByEmail(email: $email, source: $source) {
      id
      name
      slug
      email
      title
      biography
      imageFile
      socialNetworkingServices
    }
  }
`
