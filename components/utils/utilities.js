export const prependUrlWithProtocol = (url) => '//' + url

export const isValidFn = (maybeFunction) =>
  maybeFunction && {}.toString.call(maybeFunction) === '[object Function]'

export const isDebugLoggingEnabled = () => String(process.env.NEXT_PUBLIC_ENABLE_DEBUG).toLowerCase() === 'true'
