import withApollo from '../../../../lib/apolloClient'

import Head from 'next/head'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'

import { useIntl } from 'react-intl'

import { MoveForm } from '../../../../components/plays/moves/MoveForm'

function CreateMove() {
  
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <MoveForm move={null} action='create' />
      <Footer />
    </>
  )
}

export default withApollo()(CreateMove)