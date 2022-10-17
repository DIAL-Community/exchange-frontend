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

export const PLAYBOOKS_QUERY = gql`
  query SearchPlaybooks(
    $first: Int,
    $after: String,
    $search: String!,
    $tags: [String!],
    $products: [String!]
    ) {
    searchPlaybooks(
      first: $first,
      after: $after,
      search: $search,
      products: $products,
      tags: $tags
    ) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
        id
        slug
        name
        imageFile
        tags
        playbookDescription {
          id
          overview
        }
        draft
      }
    }
  }
`
