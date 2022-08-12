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

  const response = await client.query({ query, variables })

  return response.data ? fetchedDataCallback(response.data) : []
}

export const fetchSelectOptionsWithMature = async (client, input, query, fetchedDataCallback, locale = null) => {
  const variables = {
    search: input,
    mature: true
  }

  if (input && input.trim().length < MIN_SEARCH_VALUE_CHARACTERS) {
    return []
  } else if (locale) {
    variables.locale = locale
  }

  const response = await client.query({ query, variables })

  return response.data ? fetchedDataCallback(response.data) : []
}
