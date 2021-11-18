import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import apolloClient from '../../../../lib/apolloClient'

import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import QueryNotification from '../../../../components/shared/QueryNotification'
import GradientBackground from '../../../../components/shared/GradientBackground'
import RepositoryForm from '../../../../components/products/repositories/RepositoryForm'

const CreateRepository = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { slug, stepSlug } = router.query

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <RepositoryForm productSlug={slug} />
      <Footer />
    </>
  )
}

export default apolloClient()(CreateRepository)
