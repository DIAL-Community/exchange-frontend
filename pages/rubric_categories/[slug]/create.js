import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'
import { useUser } from '../../../lib/hooks'
import CategoryIndicatorForm from '../../../components/category-indicators/CategoryIndicatorForm'
import { RUBRIC_CATEGORY_QUERY } from '../../../queries/rubric-category'
import { Error } from '../../../components/shared/FetchStatus'
import NotFound from '../../../components/shared/NotFound'

const CreateCategoryIndicator = () => {
  const { query: { slug }, locale } = useRouter()

  const { isAdminUser, loadingUserSession } = useUser()

  const { loading, error, data } = useQuery(RUBRIC_CATEGORY_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.rubricCategory) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? <CategoryIndicatorForm rubricCategory={data?.rubricCategory} />
            : <Unauthorized />
        }
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateCategoryIndicator
