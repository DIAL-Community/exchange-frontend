export const parseQuery = (query, fieldName, contextValues, contextSetter) => {
  if (query[fieldName]) {
    contextValues.length = 0
    if (Array.isArray(query[fieldName])) {
      query[fieldName].forEach((entry) => {
        const [value, label] = entry.split('--')
        contextValues.push({ value, label })
      })
    } else {
      const [value, label] = query[fieldName].split('--')
      contextValues.push({ value, label })
    }

    contextSetter(contextValues)
  }
}
