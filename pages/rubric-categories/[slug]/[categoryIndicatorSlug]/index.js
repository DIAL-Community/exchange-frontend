import { useRouter } from 'next/router'
import ClientOnly from '../../../../lib/ClientOnly'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import { useUser } from '../../../../lib/hooks'
import CategoryIndicatorDetail from '../../../../components/category-indicators/CategoryIndicatorDetail'
import Header from '../../../../ui/v1/shared/Header'
import Footer from '../../../../ui/v1/shared/Footer'

const CategoryIndicator = () => {
  const { query: { slug, categoryIndicatorSlug }, locale } = useRouter()

  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? <CategoryIndicatorDetail
              rubricCategorySlug={slug}
              categoryIndicatorSlug={categoryIndicatorSlug}
              locale={locale}
            />
            : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CategoryIndicator
