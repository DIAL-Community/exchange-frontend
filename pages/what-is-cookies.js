import Head from 'next/head'
import { useIntl } from 'react-intl'

const DescribeCookies = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div
        dangerouslySetInnerHTML={{
          __html: format('consent.whatIsCookie')
        }}
      />
    </>
  )
}

export default DescribeCookies
