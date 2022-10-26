import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import NotFound from '../../../../../components/shared/NotFound'
import PlayDetail from '../../../../../components/plays/PlayDetail'
import { Loading, Error } from '../../../../../components/shared/FetchStatus'
import ClientOnly from '../../../../../lib/ClientOnly'
import { PLAY_QUERY } from '../../../../../queries/play'

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
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return (
    <>
      {
        data && data.play && data.playbook &&
          <div className='px-8 max-w-catalog mx-auto'>
            <PlayDetail playbook={data.playbook} play={data.play} />
          </div>
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
