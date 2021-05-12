import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import withApollo from '../../../lib/apolloClient'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import UseCaseDetailLeft from '../../../components/use-cases/UseCaseDetailLeft'
import UseCaseDetailRight from '../../../components/use-cases/UseCaseDetailRight'
import { Loading, Error } from '../shared/FetchStatus'

const USE_CASE_QUERY = gql`
  query UseCase($slug: String!) {
    useCase(slug: $slug) {
      id
      name
      slug
      imageFile
      useCaseDescriptions {
        description
      }
      sdgTargets {
        id
        name
        targetNumber
      }
      useCaseSteps {
        id
        name
        workflows {
          id
          name
          slug
          imageFile
        }
      }
    }
  }
`

const UseCase = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { slug } = router.query
  const { loading, error, data } = useQuery(USE_CASE_QUERY, { variables: { slug: slug } })

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    )
  }
  if (error) {
    return (
      <>
        <Header />
        <Error />
      </>
    )
  }

  const useCase = data.useCase
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='w-full h-full flex flex-col md:flex-row p-6 page-gradient'>
        <div className='w-full xl:w-1/4 md:w-1/3 pt-4'>
          <UseCaseDetailLeft useCase={useCase} />
        </div>
        <div className='w-full xl:w-3/4 md:w-2/3 pt-4 h-screen overflow-y-scroll'>
          <UseCaseDetailRight useCase={useCase} />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default withApollo()(UseCase)
