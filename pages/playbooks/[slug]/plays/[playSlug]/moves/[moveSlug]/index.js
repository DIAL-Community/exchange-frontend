import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'
import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import Header from '../../../../../../../components/Header'
import Footer from '../../../../../../../components/Footer'
import NotFound from '../../../../../../../components/shared/NotFound'
import MoveDetail from '../../../../../../../components/plays/moves/MoveDetail'
import { Loading, Error } from '../../../../../../../components/shared/FetchStatus'
import ClientOnly from '../../../../../../../lib/ClientOnly'

const MOVE_QUERY = gql`
  query Move($playbookSlug: String!, $playSlug: String!, $moveSlug: String!) {
    move(playSlug: $playSlug, slug: $moveSlug) {
      id
      name
      slug
      moveDescription {
        description
        locale
      }
    }
    play(slug: $playSlug) {
      id
      name
      slug
    }
    playbook(slug: $playbookSlug) {
      id
      name
      slug
    }
  }
`

const MoveInformation = ({ slug, playSlug, moveSlug, locale }) => {
  const { loading, error, data, refetch } = useQuery(MOVE_QUERY, {
    variables: {
      playbookSlug: slug,
      playSlug,
      moveSlug
    },
    skip: !slug && !playSlug && !moveSlug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [locale, refetch])
  
  if (loading) {
    return <Loading />
  }

  if (error && error.networkError) {
    return <Error />
  }

  if (error && !error.networkError) {
    return <NotFound />
  }

  return (
    <>
      {
        data && data.move && data.play && data.playbook &&
        <div className='px-8 mx-auto max-w-catalog'>
          <MoveDetail playbook={data.playbook} play={data.play} move={data.move} />
        </div>
      }
    </>
  )
}

const Move = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { locale, query } = router
  const { slug, playSlug, moveSlug } = query

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ClientOnly>
        <MoveInformation {...{ slug, playSlug, moveSlug, locale }} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Move
