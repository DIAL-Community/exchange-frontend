import { gql } from '@apollo/client'

export const DELETE_EXTRA_ATTRIBUTE_DEFINITION = gql`
  mutation DeleteExtraAttributeDefinition($id: ID!) {
    deleteExtraAttributeDefinition(id: $id) {
      extraAttributeDefinition {
        id
        slug
        name
      }
      errors
    }
  }
`

export const CREATE_EXTRA_ATTRIBUTE_DEFINITION = gql`
  mutation CreateExtraAttributeDefinition(
    $slug: String!
    $name: String!
    $title: String!
    $description: String!
    $entityTypes: [String!]!
    $attributeType: String!
    $attributeRequired: Boolean!
    $choices: [String!]
    $multipleChoice: Boolean
    $childExtraAttributeNames: [String!]
  ) {
    createExtraAttributeDefinition(
      slug: $slug
      name: $name
      title: $title
      description: $description
      entityTypes: $entityTypes
      attributeType: $attributeType
      attributeRequired: $attributeRequired
      choices: $choices
      multipleChoice: $multipleChoice
      childExtraAttributeNames: $childExtraAttributeNames
    ) {
      extraAttributeDefinition {
        id
        slug
        name
        title
        description
        entityTypes
        attributeType
        attributeRequired
        choices
        multipleChoice
        compositeAttributes {
          id
        }
      }
      errors
    }
  }
`
