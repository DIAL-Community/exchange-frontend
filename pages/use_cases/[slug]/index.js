import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import UseCaseDetail from '../../../components/use-cases/UseCaseDetail'
import withApollo from '../../../lib/apolloClient'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const UseCase = () => {
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
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <UseCaseDetail slug={slug} locale={locale} />
      <Footer />
    </>
  )
}

export default withApollo()(UseCase)
