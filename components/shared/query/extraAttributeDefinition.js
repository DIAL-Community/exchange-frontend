import { gql } from '@apollo/client'

export const EXTRA_ATTRIBUTE_DEFINITION_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeExtraAttributeDefinition($search: String) {
    paginationAttributeExtraAttributeDefinition(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY = gql`
  query PaginatedExtraAttributeDefinitions(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedExtraAttributeDefinitions(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      title
      description
      attributeType
    }
  }
`

export const EXTRA_ATTRIBUTE_DEFINITION_POLICY_QUERY = gql`
  query ExtraAttributeDefinition($slug: String!) {
    extraAttributeDefinition(slug: $slug) {
      id
    }
  }
`

export const EXTRA_ATTRIBUTE_DEFINITIONS_QUERY = gql`
  query ExtraAttributeDefinitions(
    $search: String
    $rootOnly: Boolean
  ) {
    extraAttributeDefinitions(
      search: $search
      rootOnly: $rootOnly
    ) {
      id
      name
      slug
      title
    }
  }
`

export const EXTRA_ATTRIBUTE_DEFINITION_DETAIL_QUERY = gql`
  query ExtraAttributeDefinition($slug: String!) {
    extraAttributeDefinition(slug: $slug) {
      id
      name
      slug
      title
      description
      attributeType
      attributeRequired
      choices
      multipleChoice
      compositeAttributes {
        id
        name
        slug
        title
        description
        attributeType
        attributeRequired
        choices
        multipleChoice
      }
    }
  }
`

export const PRODUCT_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY = gql`
  query ProductExtraAttributeDefinitions {
    productExtraAttributeDefinitions {
      id
      name
      slug
      title
      description
      attributeType
      attributeRequired
      choices
      multipleChoice
      compositeAttributes {
        id
        name
        slug
        title
        description
        attributeType
        attributeRequired
        choices
        multipleChoice
      }
    }
  }
`
