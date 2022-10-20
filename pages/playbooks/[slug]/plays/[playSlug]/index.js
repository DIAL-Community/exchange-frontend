import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import NotFound from '../../../../../components/shared/NotFound'
import PlayDetail from '../../../../../components/plays/PlayDetail'
import { Loading, Error } from '../../../../../components/shared/FetchStatus'
import ClientOnly from '../../../../../lib/ClientOnly'

const PLAY_QUERY = gql`
  query Play($playbookSlug: String!, $playSlug: String!) {
    play(slug: $playSlug) {
      id
      name
      slug
      tags
      imageFile
      playDescription {
        description
        locale
      }
      playMoves {
        name
        slug
        resources
        moveDescription {
          description
          locale
        }
      }
    }
    playbook(slug: $playbookSlug) {
      id
      name
      slug
    }
  }
`

const PlayInformation = ({ slug, playSlug, locale }) => {

  const { loading, error, data, refetch } = useQuery(PLAY_QUERY, {
    variables: { playbookSlug: slug, playSlug },
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
          <PlayDetail playbook={data.playbook} play={data.play} />
      }
    </>
  )
}

const Play = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug, playSlug } = query

  return (
    <>
      <Header />
      <ClientOnly>
        <PlayInformation slug={slug} playSlug={playSlug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Play
