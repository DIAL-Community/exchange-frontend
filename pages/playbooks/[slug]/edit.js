import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
import PlayPreview from '../../../components/plays/PlayPreview'
import { PlaybookForm } from '../../../components/playbooks/PlaybookForm'
import { PlayListProvider } from '../../../components/plays/PlayListContext'
import { PlayPreviewProvider } from '../../../components/plays/PlayPreviewContext'
import ClientOnly from '../../../lib/ClientOnly'
import NotFound from '../../../components/shared/NotFound'
import { useUser } from '../../../lib/hooks'

const PLAYBOOK_QUERY = gql`
  query Playbook($slug: String!) {
    playbook(slug: $slug) {
      id
      name
      slug
      tags
      author
      playbookDescription {
        overview
        audience
        outcomes
        locale
      }
      plays {
        id
        name
        slug
        playDescription {
          description
        }
      }
      draft
    }
  }
`

const EditFormProvider = ({ children }) => {
  return (
    <PlayListProvider>
      <PlayPreviewProvider>
        {children}
      </PlayPreviewProvider>
    </PlayListProvider>
  )
}

function EditPlaybook () {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()

  const [session] = useSession()
  const { isAdminUser, loadingUserSession } = useUser(session)

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data, refetch } = useQuery(PLAYBOOK_QUERY, {
    variables: { slug, locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

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
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      {data?.playbook && (
        <div className='max-w-catalog mx-auto'>
          <ClientOnly>
            {loadingUserSession ? <Loading /> : isAdminUser ? (
              <EditFormProvider>
                <PlayPreview />
                <PlaybookForm playbook={data.playbook} />
              </EditFormProvider>
            ) : <Unauthorized />}
          </ClientOnly>
        </div>
      )}
      <Footer />
    </>
  )
}

export default EditPlaybook
