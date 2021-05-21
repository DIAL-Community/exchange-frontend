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
query Project($slug: String!) {
  project(slug: $slug) {
    id
    name
    slug
    projectDescriptions {
      description
    }
    organizations {
      id
      slug
      name
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
  const { slug } = router.query
  const { loading, error, data } = useQuery(PROJECT_QUERY, { variables: { slug: slug } })

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
        <Footer />
      </>
    )
  }
  if (error) {
    return (
      <>
        <Header />
        <Error />
        <Footer />
      </>
    )
  }

  const project = data.project
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='w-full h-full flex flex-col md:flex-row p-6 page-gradient'>
        <div className='w-full xl:w-1/4 md:w-1/3 pt-4'>
          <ProjectDetailLeft project={project} />
        </div>
        <div className='w-full xl:w-3/4 md:w-2/3 pt-4 h-screen overflow-y-scroll'>
          <ProjectDetailRight project={project} />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default withApollo()(Project)
