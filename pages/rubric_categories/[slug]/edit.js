import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import ClientOnly from '../../../lib/ClientOnly'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
import NotFound from '../../../components/shared/NotFound'
import { RUBRIC_CATEGORY_QUERY } from '../../../queries/rubric-category'
import RubricCategoryForm from '../../../components/rubric-categories/RubricCategoryForm'
import { useUser } from '../../../lib/hooks'
import Header from '../../../ui/v1/shared/Header'
import Footer from '../../../ui/v1/shared/Footer'

const EditRubricCategory = () => {
  const { query: { slug }, locale } = useRouter()

  const { isAdminUser, loadingUserSession } = useUser()

  const { loading, error, data } = useQuery(RUBRIC_CATEGORY_QUERY, {
    variables: { slug },
    skip: !slug,
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
            ? <RubricCategoryForm rubricCategory={data?.rubricCategory} />
            : <Unauthorized />
        }
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditRubricCategory
