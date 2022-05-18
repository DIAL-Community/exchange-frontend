const MIN_SEARCH_VALUE_CHARACTERS = 2

export const fetchSelectOptions = async (client, input, query, fetchedDataCallback) => {
  if (input && input.trim().length < MIN_SEARCH_VALUE_CHARACTERS) {
    return []
  }

  const response = await client.query({
    query: query,
    variables: {
      search: input
    }
  })

  return response.data ? fetchedDataCallback(response.data) : []
}
