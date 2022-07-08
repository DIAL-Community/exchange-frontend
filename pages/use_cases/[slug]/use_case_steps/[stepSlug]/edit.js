import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import { Loading, Error } from '../../../../../components/shared/FetchStatus'
import ClientOnly from '../../../../../lib/ClientOnly'
import NotFound from '../../../../../components/shared/NotFound'
import StepForm from '../../../../../components/use-cases/steps/StepForm'
import { USE_CASE_STEP_QUERY } from '../../../../../queries/use-case-step'

const EditUseCaseStep = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { query: { slug, stepSlug } } = useRouter()

  const useCase = { slug }

  const { loading, error, data } = useQuery(USE_CASE_STEP_QUERY, {
    variables: { slug: stepSlug },
    skip: !stepSlug,
  })

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
      {data?.useCaseStep && (
        <div className='max-w-catalog mx-auto'>
          <ClientOnly>
            <StepForm useCaseStep={data.useCaseStep} useCase={useCase}/>
          </ClientOnly>
        </div>
      )}
      <Footer />
    </>
  )
}

export default EditUseCaseStep
