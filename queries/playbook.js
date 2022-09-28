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

export const PLAYBOOK_QUERY = gql`
  query Playbook($slug: String!) {
    playbook(slug: $slug) {
      id
      slug
      name
      author
      playbookDescription {
        id
        overview
        audience
        outcomes
      }
      imageFile
      playbookPlays {
        id
        playSlug
        playName
        order
      }
      plays {
        id
        slug
        playMoves {
          id
          name
        }
      }
      draft
    }
  }
`
