import withApollo from '../../../lib/apolloClient'

import Head from 'next/head'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import { useIntl } from 'react-intl'

import { PlaybookForm } from '../../../components/playbooks/PlaybookForm'

function CreatePlaybook() {
  
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <PlaybookForm playbook={null} />
      <Footer />
    </>
  )
}

export default withApollo()(CreatePlaybook)