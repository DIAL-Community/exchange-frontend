import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import Header from '../../../../../../../components/Header'
import Footer from '../../../../../../../components/Footer'
import NotFound from '../../../../../../../components/shared/NotFound'
import MoveDetail from '../../../../../../../components/plays/moves/MoveDetail'
import { Loading, Error } from '../../../../../../../components/shared/FetchStatus'
import ClientOnly from '../../../../../../../lib/ClientOnly'
import { MOVE_QUERY } from '../../../../../../../queries/move'

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
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return (
    <>
      {
        data && data.move && data.play && data.playbook &&
        <div className='px-8'>
          <MoveDetail playbook={data.playbook} play={data.play} move={data.move} />
        </div>
      }
    </>
  )
}

const Move = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug, playSlug, moveSlug } = query

  return (
    <>
      <Header />
      <ClientOnly>
        <MoveInformation {...{ slug, playSlug, moveSlug, locale }} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Move
