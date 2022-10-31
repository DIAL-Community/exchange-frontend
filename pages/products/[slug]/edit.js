import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
import ClientOnly from '../../../lib/ClientOnly'
import NotFound from '../../../components/shared/NotFound'
import ProductForm from '../../../components/products/ProductForm'
import { useProductOwnerUser, useUser } from '../../../lib/hooks'

const PRODUCT_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      website
      aliases
      productDescription {
        description
        locale
      }
    }
  }
`

const EditProduct = () => {
  const router = useRouter()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data } = useQuery(PRODUCT_QUERY, {
    variables: { slug, locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  const { isAdminUser, loadingUserSession } = useUser()
  const { isProductOwner } = useProductOwnerUser(data?.product, [], loadingUserSession || isAdminUser)

  const isAuthorized = isAdminUser || isProductOwner

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
      {data?.product && (
        <ClientOnly>
          {loadingUserSession ? <Loading /> : isAuthorized ? <ProductForm product={data.product} /> : <Unauthorized />}
        </ClientOnly>
      )}
      <Footer />
    </>
  )
}

export default EditProduct
