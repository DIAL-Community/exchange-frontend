import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import ProductForm from '../../../../components/candidate/products/ProductForm'
import Footer from '../../../../components/Footer'
import Header from '../../../../components/Header'
import { Error, Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import NotFound from '../../../../components/shared/NotFound'
import ClientOnly from '../../../../lib/ClientOnly'
import { useUser } from '../../../../lib/hooks'
import { CANDIDATE_PRODUCT_DETAIL_QUERY } from '../../../../queries/candidate'

const EditCandidateProduct = () => {
  const router = useRouter()

  const { locale } = router
  const { slug } = router.query

  const { isAdminUser, loadingUserSession } = useUser()

  const { loading, error, data } = useQuery(CANDIDATE_PRODUCT_DETAIL_QUERY, {
    variables: { slug, locale },
    skip: !isAdminUser,
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.candidateProduct) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      <ClientOnly>
        {
          loadingUserSession
            ? <Loading />
            : !isAdminUser
              ? <Unauthorized />
              : <ProductForm candidateProduct={data?.candidateProduct} />
        }
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditCandidateProduct
