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
import { Loading, Error } from '../../../components/shared/FetchStatus'

const SDG_QUERY = gql`
  query SDG($slug: String!) {
    sdg(slug: $slug) {
      id
      name
      slug
      number
      imageFile
      longTitle
      sdgTargets {
        id
        name
        imageFile
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
  const { loading, error, data } = useQuery(SDG_QUERY, { variables: { slug: slug }, skip: !slug })
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
        data && data.sdg &&
          <div className='flex justify-between'>
            <div className='relative md:sticky md:top-66px w-full md:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <SDGDetailLeft sdg={data.sdg} />
            </div>
            <div className='w-full md:w-2/3 xl:w-3/4'>
              <SDGDetailRight sdg={data.sdg} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(SDG)
