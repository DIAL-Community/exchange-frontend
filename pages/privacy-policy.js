import { useIntl } from 'react-intl'

const DescribeCookies = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: format('consent.privacyPolicy.content')
      }}
    />
  )
}

export default DescribeCookies
