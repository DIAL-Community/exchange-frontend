import { ApolloClient, from, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { createUploadLink } from 'apollo-upload-client'
import { getSession } from 'next-auth/client'

const merge = (existing, incoming, options) => {
  if (!incoming) return existing
  if (!existing) return incoming

  // If there's no 'after' in the arguments of the graph, return server data.
  if (!options.args.after) return incoming

  if (incoming.nodes.length === existing.nodes.length &&
    incoming.pageInfo.endCursor === existing.pageInfo.endCursor) {
    return existing
  }

  // Default the result to the incoming data
  const result = { ...incoming }
  // Merge existing items with the items from incoming
  result.nodes = [...existing.nodes, ...incoming.nodes]

  return result
}

const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER + '/graphql'
})

const getAuthToken = async (request) => {
  const session = await getSession(request)
  const authToken = session?.user?.userToken

  return authToken ? `Bearer ${authToken}` : ''
}

const authMiddleware = setContext(async (_, { request, headers }) => {
  const token = (await getAuthToken(request))

  return {
    headers: {
      ...headers,
      Authorization: token
    }
  }
})

const client = new ApolloClient({
  link: from([authMiddleware, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          searchPlaybookPlays: {
            keyArgs: ['search'],
            merge
          },
          searchProducts: {
            keyArgs: [
              'origins', 'sectors', 'countries', 'organizations', 'productTypes', 'sdgs', 'tags', 'useCases', 'workflows',
              'buildingBlocks', 'productDeployable', 'withMaturity', 'endorsers', 'search', 'sortColumn', 'sortDirection'
            ],
            merge
          },
          searchBuildingBlocks: {
            keyArgs: ['sdgs', 'useCases', 'workflows', 'showMature', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchWorkflows: {
            keyArgs: ['sdgs', 'useCases', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchUseCases: {
            keyArgs: ['sdgs', 'showBeta', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchSdgs: {
            keyArgs: ['sdgs', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchProjects: {
            keyArgs: ['origins', 'countries', 'sectors', 'organizations', 'products', 'sdgs', 'tags', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchOrganizations: {
            keyArgs: ['countries', 'sectors', 'years', 'search', 'endorserOnly', 'endorserLevel', 'aggregatorOnly', 'aggregators', 'sortColumn', 'sortDirection'],
            merge
          },
          capabilities: {
            keyArgs: ['capabilities', 'services', 'countryIds', 'aggregatorIds'],
            merge
          },
          operatorServices: {
            keyArgs: ['operators', 'operatorIds'],
            merge
          },
          countries: {
            keyArgs: ['search'],
            merge
          },
          searchCandidateProducts: {
            keyArgs: ['search'],
            merge
          },
          searchCandidateOrganizations: {
            keyArgs: ['search'],
            merge
          },
          searchAggregators: {
            keyArgs: ['search', 'countries', 'services'],
            merge
          },
          searchUsers: {
            keyArgs: ['search'],
            merge
          }
        }
      },
      Mutation: {
        fields: {
          createMove: {
            merge (_, incoming, { cache }) {
              cache.modify({
                fields: {
                  play (existing = []) {
                    return incoming
                  }
                }
              })

              return incoming
            }
          }
        }
      }
    }
  })
})

export default client
