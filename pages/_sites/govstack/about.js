/* eslint-disable max-len */
import Head from 'next/head'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import Header from './components/Header'
import Footer from './components/Footer'

const AboutPage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='container py-6'>
        <div className='w-[15rem] p-3 text-4xl bg-blue-900 text-white'>
          Who we are
        </div>
        <div className='w-full text-dial-gray-dark text-xl p-12'>
          The GovStack initiative is a multi-stakeholder initiative led by the Federal Ministry for Economic Cooperation and Development, Gesellschaft für Internationale Zusammenarbeit (GIZ), Estonia, the International Telecommunication Union (ITU) and the Digital Impact Alliance.
          <br />
          <br />
          The initiative actively seeks partnerships with governments, agencies, private sector organizations and the open source community
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage
