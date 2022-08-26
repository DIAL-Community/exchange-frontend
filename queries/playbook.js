import { gql } from '@apollo/client'

export const PLAYBOOK_SEARCH_QUERY = gql`
  query Playbooks($search: String ) {
    playbooks(search: $search ) {
      id
      name
      slug
    }
  }
`
