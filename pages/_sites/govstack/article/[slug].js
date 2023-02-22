import Head from 'next/head'
import Moment from 'react-moment'
import ReactMarkdown from 'react-markdown'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import { fetchAPI } from '../../../../lib/contentApi'
import Header from '../components/Header'
import Footer from '../components/Footer'

const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Article = ({ article }) => {
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
          <ReactMarkdown>{article.attributes.content}</ReactMarkdown>
          {article.attributes.author.data.attributes.picture && (
            <img
              src={
                article.attributes.author.data.attributes.picture
              }
              alt={
                article.attributes.author.data.attributes.picture.data
                  .attributes.alternativeText
              }
              style={{
                position: 'static',
                borderRadius: '20%',
                height: 60,
              }}
            />
          )}
        </div>
        <div className='uk-width-expand'>
          <p className='uk-margin-remove-bottom'>
            By {article.attributes.author.data.attributes.name}
          </p>
          <p className='uk-text-meta uk-margin-remove-top'>
            <Moment format='MMM Do YYYY'>
              {article.attributes.published_at}
            </Moment>
          </p>
        </div>
      </div>
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  const articlesRes = await fetchAPI('/articles', { fields: ['slug'] })

  if (articlesRes.data) {
    return {
      paths: articlesRes.data.map((article) => ({
        params: {
          slug: article.attributes.slug,
        },
      })),
      fallback: false,
    }
  } else {
    return { paths: [{ params: { slug: 'firstbbspecs' } }], fallback: false }
  }
}

export async function getStaticProps({ params }) {
  const articlesRes = await fetchAPI('/articles', {
    filters: {
      slug: params.slug,
    },
    populate: ['image', 'category', 'author.picture'],
  })
  const categoriesRes = await fetchAPI('/categories')

  return {
    props: { article: articlesRes.data[0], categories: categoriesRes },
    revalidate: 1,
  }
}

export default Article
