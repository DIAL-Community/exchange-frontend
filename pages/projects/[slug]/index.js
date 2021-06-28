import { useRouter } from 'next/router'
import Head from 'next/head'

import { useIntl } from 'react-intl'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import withApollo from '../../../lib/apolloClient'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import ProjectDetailLeft from '../../../components/projects/ProjectDetailLeft'
import ProjectDetailRight from '../../../components/projects/ProjectDetailRight'
import { Loading, Error } from '../../../components/shared/FetchStatus'

const PROJECT_QUERY = gql`
query Project($slug: String!, $locale: String!) {
  project(slug: $slug) {
    id
    name
    slug
    tags
    projectDescriptions {
      description
      locale
    }
    organizations {
      id
      slug
      name
      website
      whenEndorsed
      imageFile
    }
    products {
      id
      slug
      name
      imageFile
    }
    sectorsWithLocale(locale: $locale) {
      name
      slug
    }
    countries {
      name
      slug
    }
    origin {
      slug
      name
    }
  }
}
`

export async function getServerSideProps (context) {
  return {
    props: {} // will be passed to the page component as props
  }
}

const Project = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { locale } = router
  const { slug } = router.query
  const { loading, error, data } = useQuery(PROJECT_QUERY, { variables: { slug: slug, locale: locale }, skip: !slug })
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      {loading && <Loading />}
      {error && <Error />}
      {
        data && data.project &&
          <div className='flex justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative md:sticky md:top-66px w-full md:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <ProjectDetailLeft project={data.project} />
            </div>
            <div className='w-full md:w-2/3 xl:w-3/4'>
              <ProjectDetailRight project={data.project} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(Project)
