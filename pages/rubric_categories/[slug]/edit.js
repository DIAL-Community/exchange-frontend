import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
import NotFound from '../../../components/shared/NotFound'
import { RUBRIC_CATEGORY_QUERY } from '../../../queries/rubric-category'
import RubricCategoryForm from '../../../components/rubric-categories/RubricCategoryForm'
import { useUser } from '../../../lib/hooks'

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
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      <div className='max-w-catalog mx-auto'>
        <ClientOnly>
          {loadingUserSession
            ? <Loading />
            : isAdminUser
              ? (data?.rubricCategory && <RubricCategoryForm rubricCategory={data.rubricCategory} />)
              : <Unauthorized />
          }
        </ClientOnly>
      </div>
      <Footer />
    </>
  )
}

export default EditRubricCategory
