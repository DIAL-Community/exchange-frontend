import Head from 'next/head'
import { useIntl } from 'react-intl'
import withApollo from '../../../../lib/apolloClient'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import { MoveForm } from '../../../../components/plays/moves/MoveForm'

function CreateMove () {
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
