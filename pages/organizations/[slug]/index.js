
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import OrganizationDetail from '../../../components/organizations/OrganizationDetail'
import ClientOnly from '../../../lib/ClientOnly'

const Organization = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ClientOnly>
        <OrganizationDetail slug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Organization
