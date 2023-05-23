import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import RepositoryList from '../../../../../components/products/repositories/RepositoryList'
import RepositoryData from '../../../../../components/products/repositories/RepositoryData'
import Breadcrumb from '../../../../../components/shared/breadcrumb'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import ClientOnly from '../../../../../lib/ClientOnly'
import NotFound from '../../../../../components/shared/NotFound'
import { Loading, Error } from '../../../../../components/shared/FetchStatus'
import CreateButton from '../../../../../components/shared/CreateButton'
import { useProductOwnerUser, useUser } from '../../../../../lib/hooks'

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
    <div className='border-t border-l border-r'>
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

const PageDefinition = ({ slug, repositorySlug, product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser } = useUser()
  const { isProductOwner } = useProductOwnerUser(product, [], isAdminUser)

  const canEdit = isAdminUser || isProductOwner

  const slugNameMapping = (() => {
    const map = {}
    if (product) {
      map[product.slug] = product.name
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
          {canEdit && <CreateButton type='link' label={format('app.create-new')} href='create' />}
        </div>
        <ProductHeader product={product} />
        <RepositoryList productSlug={slug} repositorySlug={repositorySlug} listStyle='compact' shadowOnContainer />
      </div>
      <div className='w-full lg:w-2/3 xl:w-3/4'>
        <RepositoryData repositorySlug={repositorySlug} autoLoadData />
      </div>
    </div>
  )
}

const ProductRepository = () => {
  const router = useRouter()
  const { query } = router
  const { slug, repositorySlug } = query

  const { data, loading, error } = useQuery(PRODUCT_QUERY, { variables: { slug } })

  if (loading) {
    return <Loading/>
  } else if (error) {
    return <Error/>
  } else if (!data?.product) {
    return <NotFound/>
  }

  return (
    <>
      <Header />
      <ClientOnly>
        <PageDefinition slug={slug} repositorySlug={repositorySlug} product={data.product} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default ProductRepository
