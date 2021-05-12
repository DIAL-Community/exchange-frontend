import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import withApollo from '../../../lib/apolloClient'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import SDGDetailLeft from '../../../components/sdgs/SDGDetailLeft'
import SDGDetailRight from '../../../components/sdgs/SDGDetailRight'
import { Loading, Error } from '../shared/FetchStatus'

const SDG_QUERY = gql`
  query SDG($slug: String!) {
    sdg(slug: $slug) {
      id
      name
      slug
      imageFile
      longTitle
      sdgTargets {
        id
        name
        targetNumber
        useCases {
          id
          slug
          name
          imageFile
        }
      }
    }
  }
`

const SDG = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { slug } = router.query
  const { loading, error, data } = useQuery(SDG_QUERY, { variables: { slug: slug } })

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

  const sdg = data.sdg
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='w-full h-full flex flex-col md:flex-row p-6 page-gradient'>
        <div className='w-full xl:w-1/4 md:w-1/3 pt-4'>
          <SDGDetailLeft sdg={sdg} />
        </div>
        <div className='w-full xl:w-3/4 md:w-2/3 pt-4 h-screen overflow-y-scroll'>
          <SDGDetailRight sdg={sdg} />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default withApollo()(SDG)
