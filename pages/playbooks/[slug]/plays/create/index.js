import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import { PlayForm } from '../../../../../components/plays/PlayForm'
import { MoveListProvider } from '../../../../../components/plays/moves/MoveListContext'
import { MovePreviewProvider } from '../../../../../components/plays/moves/MovePreviewContext'
import MovePreview from '../../../../../components/plays/moves/MovePreview'
import { Loading, Error, Unauthorized } from '../../../../../components/shared/FetchStatus'
import ClientOnly from '../../../../../lib/ClientOnly'
import NotFound from '../../../../../components/shared/NotFound'
import { useUser } from '../../../../../lib/hooks'

const PLAY_QUERY = gql`
  query Play($playbookSlug: String!) {
    playbook(slug: $playbookSlug) {
      id
      name
      slug
    }
  }
`

const CreateFormProvider = ({ children }) => {
  return (
    <MoveListProvider>
      <MovePreviewProvider>
        {children}
      </MovePreviewProvider>
    </MoveListProvider>
  )
}

const CreatePlayInformation = ({ slug, locale }) => {
  const { loading, error, data } = useQuery(PLAY_QUERY, {
    variables: { playbookSlug: slug },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

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
        data?.playbook &&
          <div className='max-w-catalog mx-auto'>
            <CreateFormProvider>
              <MovePreview />
              <PlayForm playbook={data.playbook} />
            </CreateFormProvider>
          </div>
      }
    </>
  )
}

function CreatePlay () {
  const { isAdminUser, loadingUserSession } = useUser()

  const router = useRouter()
  const { locale } = router
  const { slug } = router.query

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? <CreatePlayInformation slug={slug} locale={locale} />
            : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreatePlay
