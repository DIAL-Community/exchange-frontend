import { gql } from '@apollo/client'

export const CANDIDATE_RESOURCE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeCandidateResource(
    $search: String
    $countries: [String!] 
    $inReviewOnly: Boolean
  ) {
    paginationAttributeCandidateResource(
      search: $search,
      countries: $countries
      inReviewOnly: $inReviewOnly
    ) {
      totalCount
    }
  }
`

export const PAGINATED_CANDIDATE_RESOURCES_QUERY = gql`
  query PaginatedCandidateResources(
    $search: String
    $countries: [String!]
    $inReviewOnly: Boolean
    $limit: Int!
    $offset: Int!
  ) {
    paginatedCandidateResources(
      search: $search
      countries: $countries
      inReviewOnly: $inReviewOnly
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      description
      parsedDescription
      publishedDate
      submitterEmail
      createdAt
      rejected
    }
  }
`

export const CANDIDATE_RESOURCE_POLICY_QUERY = gql`
  query CandidateResource($slug: String!) {
    candidateResource(slug: $slug) {
      id
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
      parsedDescription

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
