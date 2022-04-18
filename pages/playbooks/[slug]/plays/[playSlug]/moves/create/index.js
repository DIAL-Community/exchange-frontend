import Head from 'next/head'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../../../../../../../components/Header'
import Footer from '../../../../../../../components/Footer'
import { MoveForm } from '../../../../../../../components/plays/moves/MoveForm'
import { Error, Loading } from '../../../../../../../components/shared/FetchStatus'
import NotFound from '../../../../../../../components/shared/NotFound'
import ClientOnly from '../../../../../../../lib/ClientOnly'

const PLAY_QUERY = gql`
  query Play($playbookSlug: String!, $playSlug: String!) {
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

const CreateMoveInformation = ({ slug, playSlug, locale }) => {
  const { loading, error, data, refetch } = useQuery(PLAY_QUERY, {
    variables: { playbookSlug: slug, playSlug: playSlug },
    skip: !slug && !playSlug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [refetch, locale])
  
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
        data && data.play && data.playbook &&
          <div className='max-w-catalog mx-auto'>
            <MoveForm playbook={data.playbook} play={data.play} />
          </div>
      }
    </>
  )
}

const CreateMove = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { locale, query } = router
  const { slug, playSlug } = query

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ClientOnly>
        <CreateMoveInformation {...{slug, playSlug, locale }} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateMove
