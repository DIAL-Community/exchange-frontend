import Head from 'next/head'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import Header from './components/Header'
import Footer from './components/Footer'

const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Blog = () => {
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
        <div className='inline-block p-3 text-4xl bg-blue-900 text-white mb-5'>
          Blog
        </div>
        <div className='uk-section'>
          <div className='uk-container uk-container-large'>
            <h1>Hello!</h1>
          </div>
        </div>
      </div>
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <Footer />
    </>
  )
}

export default Blog
