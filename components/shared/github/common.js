export const DEFAULT_REPO_OWNER = process.env.NEXT_PUBLIC_API_REPO_OWNER
export const DEFAULT_BRANCH_NAME = process.env.NEXT_PUBLIC_API_REPO_BRANCH_NAME

export const prependPadding = (number, size) => {
  number = number.toString()
  while (number.length < size) {
    number = `0${number}`
  }

  return number
}
