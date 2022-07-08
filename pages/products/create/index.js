import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import ProductForm from '../../../components/products/ProductForm'
import { useUser } from '../../../lib/hooks'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'

const CreateProduct = () => {
  const [session] = useSession()

  const { isAdminUser: isAuthorized, loadingUserSession } = useUser(session)

  return(
    <>
      <Head>
        <title>{useIntl().formatMessage({ id: 'app.title' })}</title>
        <link rel='icon' href='/favicon.ico'/>
      </Head>
      <Header/>
      <div className='max-w-catalog mx-auto'>
        <ClientOnly>
          {loadingUserSession ? <Loading /> : isAuthorized ? <ProductForm /> : <Unauthorized />}
        </ClientOnly>
      </div>
      <Footer/>
    </>
  )
}

export default CreateProduct
