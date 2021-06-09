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
import { Loading, Error } from '../../../components/shared/FetchStatus'

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
      workflows {
        name
        slug
        imageFile
      }
      buildingBlocks {
        name
        slug
        maturity
        imageFile
      }
      useCaseHeaders {
        header
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
        data && data.useCase &&
          <div className='flex justify-between'>
            <div className='sticky w-1/4 h-full py-4 px-4' style={{ top: '66px' }}>
              <UseCaseDetailLeft useCase={data.useCase} />
            </div>
            <div className='w-3/4'>
              <UseCaseDetailRight useCase={data.useCase} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(UseCase)
