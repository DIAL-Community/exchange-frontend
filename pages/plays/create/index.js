import withApollo from '../../../lib/apolloClient'

import Head from 'next/head'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import { useIntl } from 'react-intl'

import { PlayForm } from '../../../components/plays/PlayForm'

function CreatePlay() {
  
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <PlayForm play={null} action='create' />
      <Footer />
    </>
  )
}

export default withApollo()(CreatePlay)