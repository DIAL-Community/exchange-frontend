import Head from 'next/head'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import EntityUpload from '../../components/entities/EntityUpload'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const EntitiesUpload = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

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

export default EntitiesUpload
