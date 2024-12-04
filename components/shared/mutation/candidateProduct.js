import { gql } from '@apollo/client'

export const CREATE_CANDIDATE_PRODUCT = gql`
  mutation CreateCandidateProduct(
    $slug: String
    $name: String!
    $website: String!
    $repository: String
    $description: String!
    $submitterEmail: String!
    $commercialProduct: Boolean
    $extraAttributes: [ExtraAttributeInput!]
    $captcha: String!
  ) {
    createCandidateProduct(
      slug: $slug
      name: $name
      website: $website
      repository: $repository
      description: $description
      submitterEmail: $submitterEmail
      commercialProduct: $commercialProduct
      extraAttributes: $extraAttributes
      captcha: $captcha
    ) {
      candidateProduct {
        id
        name
        slug
        website
        description
        extraAttributes
        candidateStatus {
          id
          name
          slug
          description
          nextCandidateStatuses {
            id
            name
            slug
            description
          }
          previousCandidateStatuses {
            id
            name
            slug
            description
          }
        }
      }
      errors
    }
  }
`

export const CANDIDATE_PRODUCT_ACTION = gql`
  mutation ApproveRejectCandidateProduct (
    $slug: String!
    $action: String!
  ) {
    approveRejectCandidateProduct (
      slug: $slug
      action: $action
    ) {
      candidateProduct {
        id
        name
        slug
  
        rejected
        rejectedDate
        rejectedBy
        approvedDate
        approvedBy
      }
      errors
    }
  }
`

export const CANDIDATE_PRODUCT_UPDATE_STATUS = gql`
  mutation UpdateCandidateProductStatus (
    $slug: String!
    $description: String
    $candidateStatusSlug: String!
  ) {
    updateCandidateProductStatus (
      slug: $slug
      description: $description
      candidateStatusSlug: $candidateStatusSlug
    ) {
      candidateProduct {
        id
        name
        slug
        candidateStatus {
          id
          name
          slug
          description
          nextCandidateStatuses {
            id
            name
            slug
            description
          }
          previousCandidateStatuses {
            id
            name
            slug
            description
          }
        }
      }
      errors
    }
  }
`

export const UPDATE_CANDIDATE_PRODUCT_CATEGORY_INDICATORS = gql`
  mutation UpdateCandidateProductCategoryIndicators(
    $slug: String!
    $categoryIndicatorValues: [JSON!]!
  ) {
    updateCandidateProductCategoryIndicators(
      slug: $slug
      categoryIndicatorValues: $categoryIndicatorValues
    ) {
      candidateProduct {
        id
        name
        slug
        overallMaturityScore
        maturityScoreDetails
      }
      errors
    }
  }
`
