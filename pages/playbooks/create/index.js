import Head from 'next/head'
import { useIntl } from 'react-intl'
import withApollo from '../../../lib/apolloClient'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import PlayPreview from '../../../components/plays/PlayPreview'
import { PlaybookForm } from '../../../components/playbooks/PlaybookForm'
import { PlayListProvider } from '../../../components/plays/PlayListContext'
import { PlayPreviewProvider } from '../../../components/plays/PlayPreviewContext'

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

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='max-w-catalog mx-auto'>
        <CreateFormProvider>
          <PlayPreview />
          <PlaybookForm />
        </CreateFormProvider>
      </div>
      <Footer />
    </>
  )
}

export default withApollo()(CreatePlaybook)
