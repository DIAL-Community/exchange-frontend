import Head from 'next/head'
import { useIntl } from 'react-intl'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

import withApollo from '../../lib/apolloClient'

import dynamic from 'next/dynamic'
import EntityUpload from '../../components/entities/EntityUpload'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const EntitiesUpload = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <EntityUpload />
      <Footer />
    </>
  )
}

export default withApollo()(EntitiesUpload)
