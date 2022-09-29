import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import ClientOnly from '../../../../lib/ClientOnly'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import { useUser } from '../../../../lib/hooks'
import CategoryIndicatorForm from '../../../../components/category-indicators/CategoryIndicatorForm'
import { Error } from '../../../../components/shared/FetchStatus'
import NotFound from '../../../../components/shared/NotFound'
import { CATEGORY_INDICATOR_QUERY } from '../../../../queries/category-indicator'
import { RUBRIC_CATEGORY_QUERY } from '../../../../queries/rubric-category'

const EditCategoryIndicator = () => {
  const { query: { slug, categoryIndicatorSlug }, locale } = useRouter()

  const { isAdminUser, loadingUserSession } = useUser()

  const { loading, error, data: categoryIndicatorData } = useQuery(CATEGORY_INDICATOR_QUERY, {
    variables: { slug: categoryIndicatorSlug },
    context: { headers: { 'Accept-Language': locale } },
  })

  const { data: rubricCategoryData } = useQuery(RUBRIC_CATEGORY_QUERY, { variables: { slug } })

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
              ? (
                <CategoryIndicatorForm
                  rubricCategory={rubricCategoryData?.rubricCategory}
                  categoryIndicator={categoryIndicatorData?.categoryIndicator}
                />
              ) : <Unauthorized />
          }
        </ClientOnly>
      </div>
      <Footer />
    </>
  )
}

export default EditCategoryIndicator
