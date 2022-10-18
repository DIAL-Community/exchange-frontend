import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import RepositoryList from '../../../../components/products/repositories/RepositoryList'
import Breadcrumb from '../../../../components/shared/breadcrumb'
import ClientOnly from '../../../../lib/ClientOnly'
import NotFound from '../../../../components/shared/NotFound'
import { Loading, Error } from '../../../../components/shared/FetchStatus'
import { useProductOwnerUser, useUser } from '../../../../lib/hooks'
import CreateButton from '../../../../components/shared/CreateButton'

const PRODUCT_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      imageFile
    }
  }
`

const ProductHeader = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='border'>
      <Link href={`/products/${product.slug}`}>
        <a href='navigate-to-product'>
          <div className='cursor-pointer px-4 py-6 flex items-center'>
            <img
              className='w-8 h-full'
              alt={format('image.alt.logoFor', { name: product.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
            />
            <div className='text-xl text-product font-semibold px-4'>{product.name}</div>
          </div>
        </a>
      </Link>
    </div>
  )
}

const PageDefinition = ({ slug, repositorySlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser } = useUser()
  const { isProductOwner } = useProductOwnerUser(data?.product, [], isAdminUser)

  const canEdit = isAdminUser || isProductOwner

  const { data, loading, error } = useQuery(PRODUCT_QUERY, { variables: { slug } })

  if (loading) {
    return <Loading/>
  } else if (error && error.networkError) {
    return <Error/>
  } else if (error && !error.networkError) {
    return <NotFound/>
  }

  const slugNameMapping = (() => {
    const map = {}
    if (data) {
      map[data.product.slug] = data.product.name
    }

    return map
  })()

  return (
    <div className='flex flex-wrap justify-between pb-8'>
      <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
        <div className='block lg:hidden'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='w-full mb-2'>
          {canEdit && <CreateButton type='link' label={format('app.create-new')} href='repositories/create' />}
        </div>
        {data?.product && <ProductHeader product={data.product} />}
        <RepositoryList productSlug={slug} repositorySlug={repositorySlug} listStyle='compact' shadowOnContainer />
      </div>
      <div className='w-full lg:w-2/3 xl:w-3/4'>
        <div className='hidden lg:block'>
          <div className='px-4'>
            <Breadcrumb slugNameMapping={slugNameMapping} />
          </div>
        </div>
      </div>
    </div>
  )
}

const ProductRepositories = () => {
  const router = useRouter()
  const { query } = router
  const { slug, repositorySlug } = query

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

export default ProductRepositories
