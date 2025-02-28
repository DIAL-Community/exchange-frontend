import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'

const MIN_SEARCH_VALUE_CHARACTERS = 2

export const fetchSelectOptions = async (client, input, query, fetchedDataCallback, locale = null) => {
  const variables = {
    search: input
  }

  if (input && input.trim().length < MIN_SEARCH_VALUE_CHARACTERS) {
    return []
  } else if (locale) {
    variables.locale = locale
  }

  const response = await client.query({
    query,
    variables,
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return response.data ? fetchedDataCallback(response.data) : []
}

export const fetchSelectOptionsWithMaturity = async (client, input, query, fetchedDataCallback, locale = null) => {
  const variables = {
    mature: true,
    search: input
  }

  if (input && input.trim().length < MIN_SEARCH_VALUE_CHARACTERS) {
    return []
  } else if (locale) {
    variables.locale = locale
  }

  const response = await client.query({
    query,
    variables,
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return response.data ? fetchedDataCallback(response.data) : []
}
