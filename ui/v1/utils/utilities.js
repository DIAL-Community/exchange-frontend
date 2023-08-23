export const prependUrlWithProtocol = (url) => '//' + url

export const isValidFn = (maybeFunction) =>
  maybeFunction && {}.toString.call(maybeFunction) === '[object Function]'
