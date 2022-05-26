import { gql } from '@apollo/client'

export const CONTACT_SEARCH_QUERY = gql`
  query Contacts($search: String!) {
    contact(search: $search) {
      id
      name
      slug
      email
      title
    }
  }
`
