import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import { Loading, Error } from '../../../../../components/shared/FetchStatus'
import ClientOnly from '../../../../../lib/ClientOnly'
import NotFound from '../../../../../components/shared/NotFound'
import StepForm from '../../../../../components/use-cases/steps/StepForm'
import { USE_CASE_STEP_QUERY } from '../../../../../queries/use-case-step'

const EditUseCaseStep = () => {
  const { query: { slug, stepSlug } } = useRouter()

  const { loading, error, data } = useQuery(USE_CASE_STEP_QUERY, {
    variables: { slug: stepSlug, useCaseSlug: slug },
    skip: !stepSlug,
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.useCaseStep) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      <ClientOnly>
        { data?.useCaseStep && data?.useCase &&
          <StepForm
            useCase={data.useCase}
            useCaseStep={data.useCaseStep}
          />
        }
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditUseCaseStep
