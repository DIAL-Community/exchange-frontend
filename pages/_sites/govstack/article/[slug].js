import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Article = () => {
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
        <div>
          <ReactMarkdown>Hello</ReactMarkdown>
        </div>
        <div className='uk-width-expand'>
          <p className='uk-margin-remove-bottom'>
            By me
          </p>
          <p className='uk-text-meta uk-margin-remove-top'>
            Today
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Article
