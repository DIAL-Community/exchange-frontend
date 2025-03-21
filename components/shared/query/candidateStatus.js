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

export const INITIAL_CANDIDATE_STATUS_SEARCH_QUERY = gql`
  query InitialCandidateStatuses($search: String) {
    initialCandidateStatuses(search: $search) {
      id
      slug
      name
      initialStatus
      terminalStatus
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
      notificationTemplate
      nextCandidateStatuses {
        id
      }
      previousCandidateStatuses {
        id
      }
    }
  }
`

export const CANDIDATE_STATUS_POLICY_QUERY = gql`
  query CandidateStatus($slug: String!) {
    candidateStatus(slug: $slug) {
      id
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
      notificationTemplate
      nextCandidateStatuses {
        id
        name
        slug
        description
        initialStatus
        terminalStatus
      }
      previousCandidateStatuses {
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
