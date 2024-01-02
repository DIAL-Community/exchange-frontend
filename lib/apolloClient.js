import { ApolloClient, from, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { getSession } from 'next-auth/react'
import { useMemo } from 'react'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient

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

const merge = (existing, incoming, options) => {
  if (!incoming) return existing
  if (!existing) return incoming
  // If there's no 'after' in the arguments of the graph, return server data.
  if (!options.args?.after) return incoming

  if (incoming.nodes.length === existing.nodes.length &&
    incoming.pageInfo.endCursor === existing.pageInfo.endCursor) {
    return existing
  }

  // Default the result to the incoming data
  const result = { ...incoming }
  // Merge existing items with the items from incoming
  const seen = {}
  result.nodes = [...existing.nodes, ...incoming.nodes]
    .filter(node => {
      // TODO: Need to make sure this key is still correct.
      const key = node.__ref

      return seen[key] ? false : (seen[key] = true)
    })

  return result
}

const createApolloClient = () => new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: from([authMiddleware, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          searchOpportunities: {
            keyArgs: ['search', 'sectors', 'countries', 'organizations', 'useCases', 'buildingBlocks'],
            merge
          },
          searchPlaybookPlays: {
            keyArgs: ['search'],
            merge
          },
          searchProducts: {
            keyArgs: [
              'origins', 'sectors', 'countries', 'organizations', 'productTypes', 'sdgs', 'tags',
              'useCases', 'workflows', 'buildingBlocks', 'productDeployable', 'isEndorsed', 'endorsers',
              'search', 'sortColumn', 'sortDirection', 'licenseTypes', 'isLinkedWithDpi'
            ],
            merge
          },
          searchDatasets: {
            keyArgs: [
              'origins', 'sectors', 'countries', 'organizations', 'sdgs', 'tags', 'datasetTypes',
              'search', 'sortColumn', 'sortDirection'
            ],
            merge
          },
          searchBuildingBlocks: {
            keyArgs: [
              'sdgs', 'useCases', 'workflows', 'showMature', 'categoryTypes', 'search', 'sortColumn',
              'sortDirection'
            ],
            merge
          },
          searchWorkflows: {
            keyArgs: ['sdgs', 'useCases', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchUseCases: {
            keyArgs: ['sdgs', 'showBeta', 'showGovStackOnly', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchSdgs: {
            keyArgs: ['sdgs', 'search', 'sortColumn', 'sortDirection'],
            merge
          },
          searchProjects: {
            keyArgs: [
              'origins', 'countries', 'sectors', 'organizations', 'products', 'sdgs', 'tags',
              'search', 'sortColumn', 'sortDirection'
            ],
            merge
          },
          searchOrganizations: {
            keyArgs: [
              'countries', 'sectors', 'years', 'search', 'endorserOnly', 'endorserLevel',
              'aggregatorOnly', 'aggregators', 'sortColumn', 'sortDirection'
            ],
            merge
          },
          searchStorefronts: {
            keyArgs: [
              'countries', 'sectors', 'specialties', 'buildingBlocks', 'certifications',
              'search', 'sortColumn', 'sortDirection'
            ],
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
          },
          searchSectors: {
            keyArgs: ['search'],
            merge
          },
          searchTags: {
            keyArgs: ['search'],
            merge
          },
          searchCountries: {
            keyArgs: ['search'],
            merge
          },
          searchPlays: {
            keyArgs: ['search'],
            merge
          },
          searchCandidateRoles: {
            keyArgs: ['search'],
            merge
          },
          searchResources: {
            keyArgs: ['search'],
            merge
          }
        }
      },
      Mutation: {
        fields: {
          createMove: {
            merge(_, incoming, { cache }) {
              cache.modify({
                fields: {
                  play() {
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

export const initializeApollo = (initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => JSON.stringify(d) !== JSON.stringify(s))
        )
      ]
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export const addApolloState = (client, pageProps) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export const useApollo = (pageProps) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])

  return store
}
