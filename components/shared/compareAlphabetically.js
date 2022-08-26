export const compareAlphabetically = (a, b) => {
  const labelA = a.label.toUpperCase()
  const labelB = b.label.toUpperCase()

  return labelA.localeCompare(labelB)
}
