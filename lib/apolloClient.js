import { withApollo } from 'next-apollo'
import { ApolloClient, InMemoryCache } from '@apollo/client'

const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER + '/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            keyArgs: false,
            merge (existing, incoming) {
              if (!incoming) return existing
              if (!existing) return incoming // existing will be empty the first time

              const { nodes, ...rest } = incoming

              const result = rest
              result.nodes = [...existing.nodes, ...nodes] // Merge existing items with the items from incoming
              return result
            }
          }
        }
      }
    }
  })
})

export default withApollo(apolloClient)
