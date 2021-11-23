import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import NotFound from '../../../../components/shared/NotFound'

import withApollo from '../../../../lib/apolloClient'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import MoveDetail from '../../../../components/plays/moves/MoveDetail'
import { Loading, Error } from '../../../../components/shared/FetchStatus'
import { useEffect } from 'react'

const MOVE_QUERY = gql`
  query Move($slug: String!) {
    move(slug: $slug) {
      id
      name
      slug
      moveDescriptions {
        description
        locale
      }
      play {
        name
        slug
      }
    }
  }
`

const Move = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { pathname, asPath, query } = useRouter()

  const { slug } = router.query
  const { loading, error, data } = useQuery(MOVE_QUERY, { variables: { slug: slug }, skip: !slug })

  useEffect(() => {
    if (query.locale) {
      router.replace({ pathname }, asPath, { locale: query.locale })
    }
  })

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
        data && data.move &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <MoveDetail play={data.move} />
            </div>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(Move)
