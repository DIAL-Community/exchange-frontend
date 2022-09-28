import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const DescribeCookies = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: format('consent.privacyPolicy.content')
      }}
    />
  )
}

export default DescribeCookies
