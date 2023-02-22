import Head from 'next/head'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import { fetchAPI } from '../../../lib/contentApi'
import Header from './components/Header'
import Footer from './components/Footer'
import Articles from './components/articles'

const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Blog = ({ articles, homepage }) => {
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
            <h1>{homepage.attributes.hero.title}</h1>
            <Articles articles={articles} />
          </div>
        </div>
      </div>
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <Footer />
    </>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [articlesRes, categoriesRes, homepageRes] = await Promise.all([
    fetchAPI('/articles', { populate: ['image', 'category'] }),
    fetchAPI('/categories', { populate: '*' }),
    fetchAPI('/homepage', {
      populate: {
        hero: '*',
        seo: { populate: '*' },
      },
    }),
  ])

  return {
    props: {
      articles: articlesRes.data,
      categories: categoriesRes.data,
      homepage: homepageRes.data,
    },
    revalidate: 1,
  }
}

export default Blog
