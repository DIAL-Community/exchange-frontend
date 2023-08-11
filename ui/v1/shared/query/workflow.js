import { gql } from '@apollo/client'

export const WORKFLOW_SEARCH_QUERY = gql`
  query Workflows($search: String) {
    workflows(search: $search) {
      id
      name
      slug
    }
  }
`

export const WORKFLOW_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeWorkflow(
    $search: String
  ) {
    paginationAttributeWorkflow(
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_WORKFLOWS_QUERY = gql`
  query PaginatedWorkflows(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedWorkflows(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      imageFile
      workflowDescription {
        id
        description
        locale
      }
      buildingBlocks {
        id
      }
      useCases {
        id
      }
    }
  }
`

export const WORKFLOW_DETAIL_QUERY = gql`
  query Workflow($slug: String!) {
    workflow(slug: $slug) {
      id
      name
      slug
      imageFile
      workflowDescription {
        description
        locale
      }
      useCases {
        slug
        name
        maturity
        imageFile
      }
      buildingBlocks {
        name
        slug
        maturity
        imageFile
      }
    }
  }
`
