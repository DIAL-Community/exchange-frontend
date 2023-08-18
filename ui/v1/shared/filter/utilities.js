export const compareAlphabetically = (a, b) => {
  const firstLabel = a.label.toUpperCase()
  const secondLabel = b.label.toUpperCase()

  return firstLabel.localeCompare(secondLabel)
}
