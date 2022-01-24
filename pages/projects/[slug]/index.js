import { useRouter } from 'next/router'
import Head from 'next/head'

import { useIntl } from 'react-intl'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import NotFound from '../../../components/shared/NotFound'
import withApollo from '../../../lib/apolloClient'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import ProjectDetailLeft from '../../../components/projects/ProjectDetailLeft'
import ProjectDetailRight from '../../../components/projects/ProjectDetailRight'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import { useEffect } from 'react'

const PROJECT_QUERY = gql`
query Project($slug: String!) {
  project(slug: $slug) {
    id
    name
    slug
    tags
    projectDescription {
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
    sectors {
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
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { locale, pathname, asPath, query } = useRouter()

  const { slug } = router.query
  const { loading, error, data, refetch } = useQuery(PROJECT_QUERY, {
    variables: { slug: slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  useEffect(() => {
    if (query.locale) {
      router.replace({ pathname }, asPath, { locale: query.locale })
    }
  })

  useEffect(() => {
    refetch()
  }, [locale])

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.project &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <ProjectDetailLeft project={data.project} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <ProjectDetailRight project={data.project} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(Project)
