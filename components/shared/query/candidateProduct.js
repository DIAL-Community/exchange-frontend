import { gql } from '@apollo/client'

export const CANDIDATE_PRODUCT_EXTRA_ATTRIBUTES_QUERY = gql`
  query CandidateProductExtraAttributes {
    candidateProductExtraAttributes
  }
`

export const CANDIDATE_PRODUCT_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeCandidateProduct($currentUserOnly: Boolean, $search: String) {
    paginationAttributeCandidateProduct(currentUserOnly: $currentUserOnly, search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_CANDIDATE_PRODUCTS_QUERY = gql`
  query PaginatedCandidateProducts(
    $currentUserOnly: Boolean
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedCandidateProducts(
      currentUserOnly: $currentUserOnly
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      website
      description
      submitterEmail
      candidateStatus {
        id
        name
        slug
        description
      }
      createdAt
      rejected
    }
  }
`

export const CANDIDATE_PRODUCT_POLICY_QUERY = gql`
  query CandidateProduct($slug: String!) {
    candidateProduct(slug: $slug) {
      id
    }
  }
`

export const CANDIDATE_PRODUCT_DETAIL_QUERY = gql`
  query CandidateProduct($slug: String!) {
    candidateProduct(slug: $slug) {
      id
      name
      slug
      website
      repository
      description
      submitterEmail
      extraAttributes
      overallMaturityScore
      maturityScoreDetails
      candidateStatus {
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
          initialStatus
          terminalStatus
        }
      }
      createdAt
      rejected
      rejectedDate
      rejectedBy
      approvedDate
      approvedBy
    }
  }
`

export const CANDIDATE_PRODUCT_CATEGORY_INDICATORS_QUERY = gql`
  query CandidateProduct($slug: String!) {
    candidateProduct(slug: $slug) {
      id
      candidateProductCategoryIndicators {
        id
        indicatorValue
        categoryIndicator {
          id
          slug
          name
          indicatorType
          categoryIndicatorDescription {
            id
            description
          }
          rubricCategory {
            id
            name
          }
        }
      }
      notAssignedCategoryIndicators {
        id
        slug
        name
        indicatorType
        categoryIndicatorDescription {
          id
          description
        }
        rubricCategory {
          id
          name
        }
      }
    }
  }
`
