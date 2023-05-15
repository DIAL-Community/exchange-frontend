import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import { useCallback } from 'react'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import Breadcrumb from '../../../../../components/shared/breadcrumb'
import RepositoryList from '../../../../../components/products/repositories/RepositoryList'
import RepositoryForm from '../../../../../components/products/repositories/RepositoryForm'
import ClientOnly from '../../../../../lib/ClientOnly'
import NotFound from '../../../../../components/shared/NotFound'
import { Loading, Error, Unauthorized } from '../../../../../components/shared/FetchStatus'
import { useProductOwnerUser, useUser } from '../../../../../lib/hooks'

const REPOSITORY_QUERY = gql`
  query ProductRepository($slug: String!) {
    productRepository(slug: $slug) {
      name
      slug
      description
      absoluteUrl
      mainRepository

      product {
        name
        slug
        imageFile
      }
    }
  }
`

const ProductHeader = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='border'>
      <Link href={`/products/${product.slug}`}>
        <div className='cursor-pointer px-4 py-6 flex items-center'>
          <img
            className='w-8 h-full'
            alt={format('image.alt.logoFor', { name: product.name })}
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
          />
          <div className='text-xl text-product font-semibold px-4'>{product.name}</div>
        </div>
      </Link>
    </div>
  )
}

const PageDefinition = ({ slug, repositorySlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data, loading, error } = useQuery(REPOSITORY_QUERY, { variables: { slug: repositorySlug } })

  const { isAdminUser, loadingUserSession } = useUser()
  const { isProductOwner } = useProductOwnerUser(data?.productRepository?.product, [], isAdminUser)

  const isAuthorized = isAdminUser || isProductOwner

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.productRepository) {
    return <NotFound />
  }

  const slugNameMapping = (() => {
    const map = { edit: format('app.edit') }
    if (data) {
      map[data.productRepository.product.slug] = data.productRepository.product.name
      map[data.productRepository.slug] = data.productRepository.name
    }

    return map
  })()

  return (
    <>
      {loadingUserSession
        ? <Loading />
        : isAuthorized
          ? <div className='flex flex-wrap justify-between pb-8'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <div className='block lg:hidden'>
                <Breadcrumb slugNameMapping={slugNameMapping} />
              </div>
              {data?.productRepository && <ProductHeader product={data.productRepository.product} />}
              <RepositoryList
                productSlug={slug}
                repositorySlug={repositorySlug}
                listStyle='compact'
                shadowOnContainer
              />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <div className='hidden lg:block'>
                <div className='px-4'>
                  <Breadcrumb slugNameMapping={slugNameMapping} />
                </div>
              </div>
              <div className='w-full lg:w-2/3 xl:w-3/4'>
                <RepositoryForm productRepository={data?.productRepository} productSlug={slug} />
              </div>
            </div>
          </div >
          : <Unauthorized />
      }
    </>
  )
}

const EditRepository = () => {
  const router = useRouter()
  const { slug, repositorySlug } = router.query

  return (
    <>
      <Header />
      <ClientOnly>
        <PageDefinition slug={slug} repositorySlug={repositorySlug} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditRepository
