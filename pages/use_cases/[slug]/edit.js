import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import ClientOnly from '../../../lib/ClientOnly'
import NotFound from '../../../components/shared/NotFound'
import UseCaseForm from '../../../components/use-cases/UseCaseForm'
import { USE_CASE_QUERY } from '../../../queries/use-case'

const EditUseCase = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data, refetch } = useQuery(USE_CASE_QUERY, {
    variables: { slug, locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      {data?.useCase && (
        <div className='max-w-catalog mx-auto'>
          <ClientOnly>
            <UseCaseForm useCase={data.useCase} />
          </ClientOnly>
        </div>
      )}
      <Footer />
    </>
  )
}

export default EditUseCase
