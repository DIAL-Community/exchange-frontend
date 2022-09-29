import { useRouter } from 'next/router'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import ClientOnly from '../../../../lib/ClientOnly'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import { useUser } from '../../../../lib/hooks'
import CategoryIndicatorDetail from '../../../../components/category-indicators/CategoryIndicatorDetail'

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
            ? <CategoryIndicatorDetail rubricCategorySlug={slug} categoryIndicatorSlug={categoryIndicatorSlug} locale={locale} />
            : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CategoryIndicator
