import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import NotFound from '../../../components/shared/NotFound'

import withApollo from '../../../lib/apolloClient'
import { gql, useQuery } from '@apollo/client'

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
  const format = (id, values) => formatMessage({ id: id }, values)

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
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.sdg &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <SDGDetailLeft sdg={data.sdg} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <SDGDetailRight sdg={data.sdg} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(SDG)
