import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import PlayPreview from '../../../components/plays/PlayPreview'
import { PlaybookForm } from '../../../components/playbooks/PlaybookForm'
import { PlayListProvider } from '../../../components/plays/PlayListContext'
import { PlayPreviewProvider } from '../../../components/plays/PlayPreviewContext'
import ClientOnly from '../../../lib/ClientOnly'
import { useUser } from '../../../lib/hooks'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'

const CreateFormProvider = ({ children }) => {
  return (
    <PlayListProvider>
      <PlayPreviewProvider>
        {children}
      </PlayPreviewProvider>
    </PlayListProvider>
  )
}

function CreatePlaybook () {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [session] = useSession()
  const { isAdminUser, loadingUserSession } = useUser(session)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='max-w-catalog mx-auto'>
        <ClientOnly>
          {loadingUserSession ? <Loading /> : isAdminUser ? (
            <CreateFormProvider>
              <PlayPreview />
              <PlaybookForm />
            </CreateFormProvider>
          ) : <Unauthorized />}
        </ClientOnly>
      </div>
      <Footer />
    </>
  )
}

export default CreatePlaybook
