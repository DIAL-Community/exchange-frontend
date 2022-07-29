import Head from 'next/head'
import { useIntl } from 'react-intl'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ClientOnly from '../../lib/ClientOnly'
import WorkflowForm from '../../components/workflows/WorkflowForm'

const CreateBuildingBlock = () => (
  <>
    <Head>
      <title>{useIntl().formatMessage({ id: 'app.title' })}</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>
    <Header />
    <div className='max-w-catalog mx-auto'>
      <ClientOnly>
        <WorkflowForm />
      </ClientOnly>
    </div>
    <Footer />
  </>
)

export default CreateBuildingBlock
