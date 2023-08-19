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

export const PLAYBOOK_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributePlaybook(
    $tags: [String!]
    $search: String
  ) {
    paginationAttributePlaybook(
      tags: $tags
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_PLAYBOOKS_QUERY = gql`
  query PaginatedPlaybooksRedux(
    $tags: [String!]
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedPlaybooksRedux(
      tags: $tags
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
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
`

export const PLAYBOOK_QUERY = gql`
  query Playbook($slug: String!) {
    playbook(slug: $slug) {
      id
      slug
      name
      tags
      author
      playbookDescription {
        id
        overview
        audience
        outcomes
        locale
      }
      imageFile
      playbookPlays {
        id
        playSlug
        playName
        playOrder
      }
      plays {
        id
        name
        slug
        playMoves {
          id
          name
        }
        playDescription {
          id
          description
        }
      }
      draft
    }
  }
`

export const PLAYBOOK_PLAYS_QUERY = gql`
  query SearchPlaybookPlays($first: Int, $after: String, $slug: String!) {
    searchPlaybookPlays(first: $first, after: $after, slug: $slug) {
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
        playDescription {
          id
          description
        }
        playMoves {
          id
          slug
          name
        }
        products {
          id
          name
          slug
          imageFile
        }
        buildingBlocks {
          id
          name
          slug
          imageFile
        }
      }
    }
  }
`
