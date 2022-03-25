import Head from 'next/head'
import { useIntl } from 'react-intl'
import withApollo from '../../../lib/apolloClient'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { PlayForm } from '../../../components/plays/PlayForm'

function CreatePlay () {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <PlayForm />
      <Footer />
    </>
  )
}

export default withApollo()(CreatePlay)
