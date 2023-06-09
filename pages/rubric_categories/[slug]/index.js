import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import RubricCategoryDetail from '../../../components/rubric-categories/RubricCategoryDetail'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'
import { useUser } from '../../../lib/hooks'

const RubricCategory = () => {
  const { query: { slug }, locale } = useRouter()

  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? <RubricCategoryDetail slug={slug} locale={locale} />
            : <Unauthorized />
        }
      </ClientOnly>
      <Footer />
    </>
  )
}

export default RubricCategory
