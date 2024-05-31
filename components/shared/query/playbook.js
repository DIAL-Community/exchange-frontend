import { gql } from '@apollo/client'

export const PLAYBOOK_SEARCH_QUERY = gql`
  query Playbooks($search: String, $owner: String!) {
    playbooks(search: $search, owner: $owner) {
      id
      name
      slug
    }
  }
`

export const PLAYBOOK_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributePlaybook(
    $tags: [String!]
    $owner: String!
    $search: String
  ) {
    paginationAttributePlaybook(
      tags: $tags
      owner: $owner
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_PLAYBOOKS_QUERY = gql`
  query PaginatedPlaybooks(
    $tags: [String!]
    $owner: String!
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedPlaybooks(
      tags: $tags
      owner: $owner
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
        sanitizedOverview
      }
      plays {
        id
      }
      draft
    }
  }
`

export const PLAYBOOK_DETAIL_QUERY = gql`
  query Playbook($slug: String!, $owner: String!) {
    playbook(slug: $slug, owner: $owner) {
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
          slug
          name
        }
        playDescription {
          id
          description
        }
      }
      draft
      ownedBy
    }
  }
`
