import { gql } from '@apollo/client'

export const PRODUCT_REPOSITORY_POLICY_QUERY = gql`
  query ProductRepository($productSlug: String!, $repositorySlug: String!) {
    productRepository(slug: $repositorySlug, productSlug: $productSlug) {
      id
    }
  }
`

export const PRODUCT_REPOSITORY_DETAIL_QUERY = gql`
  query ProductRepository($productSlug: String!, $repositorySlug: String!) {
    productRepository(slug: $repositorySlug, productSlug: $productSlug) {
      id
      name
      slug
      description
      absoluteUrl
      mainRepository

      license

      languageData
      statisticalData
    }
    product(slug: $productSlug) {
      id
      name
      slug
      website
      imageFile
      mainRepository {
        id
        name
        slug
        license
      }
      sectors {
        id
        name
        slug
      }
    }
  }
`

export const PRODUCT_SIMPLE_QUERY =  gql`
  query Product($productSlug: String!) {
    product(slug: $productSlug) {
      id
      name
      slug
      website
      imageFile
      mainRepository {
        id
        name
        slug
        license
      }
      sectors {
        id
        name
        slug
      }
    }
  }
`

export const PRODUCT_REPOSITORIES_QUERY = gql`
  query ProductRepositories($productSlug: String!) {
    productRepositories(slug: $productSlug) {
      id
      name
      slug
    }
  }
`
