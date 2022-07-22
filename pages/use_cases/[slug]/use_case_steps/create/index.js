import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import ClientOnly from '../../../../../lib/ClientOnly'
import StepForm from '../../../../../components/use-cases/steps/StepForm'
import { Error, Loading } from '../../../../../components/shared/FetchStatus'
import NotFound from '../../../../../components/shared/NotFound'
import { USE_CASE_QUERY } from '../../../../../queries/use-case'

const CreateUseCaseStep = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()

  const { locale } = router
  const { slug } = router.query

  const { loading, error, data } = useQuery(USE_CASE_QUERY, {
    variables: { slug: slug, locale: locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return(
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      {data?.useCase &&
        <div className='max-w-catalog mx-auto'>
          <ClientOnly>
            <StepForm useCase={data.useCase}/>
          </ClientOnly>
        </div>
      }
      <Footer />
    </>
  )}

export default CreateUseCaseStep
