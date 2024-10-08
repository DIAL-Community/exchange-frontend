import { gql } from '@apollo/client'

export const CANDIDATE_STATUS_SEARCH_QUERY = gql`
  query CandidateStatuses($search: String) {
    candidateStatuses(search: $search) {
      id
      slug
      name
    }
  }
`

export const CANDIDATE_STATUS_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeCandidateStatus($search: String) {
    paginationAttributeCandidateStatus(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_CANDIDATE_STATUSES_QUERY = gql`
  query PaginatedCandidateStatuses(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedCandidateStatuses(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      description
      initialStatus
      terminalStatus
      nextCandidateStatuses {
        id
      }
    }
  }
`

export const CANDIDATE_STATUS_DETAIL_QUERY = gql`
  query CandidateStatus($slug: String!) {
    candidateStatus(slug: $slug) {
      id
      name
      slug
      description
      initialStatus
      terminalStatus
      nextCandidateStatuses {
        id
        name
        slug
        description
        initialStatus
        terminalStatus
      }
    }
  }
`
