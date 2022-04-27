import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import { PlayForm } from '../../../../../components/plays/PlayForm'
import { MoveListProvider } from '../../../../../components/plays/moves/MoveListContext'
import { MovePreviewProvider } from '../../../../../components/plays/moves/MovePreviewContext'
import MovePreview from '../../../../../components/plays/moves/MovePreview'
import { Loading, Error } from '../../../../../components/shared/FetchStatus'
import ClientOnly from '../../../../../lib/ClientOnly'
import NotFound from '../../../../../components/shared/NotFound'

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
        data && data.playbook &&
          <div className='px-8 max-w-catalog mx-auto'>
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
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { locale } = router
  const { slug } = router.query

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ClientOnly>
        <CreatePlayInformation slug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreatePlay
