import { gql } from '@apollo/client'

export const CANDIDATE_RESOURCE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeCandidateResource($search: String) {
    paginationAttributeCandidateResource(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_CANDIDATE_RESOURCES_QUERY = gql`
  query PaginatedCandidateResources(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedCandidateResources(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      description
      publishedDate
      submitterEmail
      createdAt
      rejected
    }
  }
`

export const CANDIDATE_RESOURCE_DETAIL_QUERY = gql`
  query CandidateResource($slug: String!) {
    candidateResource(slug: $slug) {
      id
      name
      slug
      description
      resourceType
      resourceLink
      linkDescription
      publishedDate
      submitterEmail
      createdAt

      countries {
        id
        name
      }

      rejected
      rejectedDate
      rejectedBy
      approvedDate
      approvedBy
    }
  }
`
