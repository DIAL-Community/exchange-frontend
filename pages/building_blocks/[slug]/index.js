import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import BuildingBlockDetail from '../../../components/building-blocks/BuildingBlockDetail'
import ClientOnly from '../../../lib/ClientOnly'

const BuildingBlock = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

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
        <BuildingBlockDetail slug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default BuildingBlock
