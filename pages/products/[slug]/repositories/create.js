import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import { useCallback } from 'react'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import RepositoryForm from '../../../../components/products/repositories/RepositoryForm'
import Breadcrumb from '../../../../components/shared/breadcrumb'
import RepositoryList from '../../../../components/products/repositories/RepositoryList'
import ClientOnly from '../../../../lib/ClientOnly'
import NotFound from '../../../../components/shared/NotFound'
import { Loading, Error } from '../../../../components/shared/FetchStatus'

const PRODUCT_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      name
      slug
      imageFile
    }
  }
`

const ProductHeader = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

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

const PageDefinition = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data, loading, error } = useQuery(PRODUCT_QUERY, { variables: { slug } })

  if (loading) {
    return <Loading />
  }

  if (error && error.networkError) {
    return <Error />
  }

  if (error && !error.networkError) {
    return <NotFound />
  }

  const slugNameMapping = (() => {
    const map = { create: format('app.create') }

    map[data?.product.slug] = data?.product.name

    return map
  })()

  return (
    <div className='flex flex-wrap justify-between pb-8 max-w-catalog mx-auto'>
      <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
        <div className='block lg:hidden'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        {data?.product && <ProductHeader product={data.product} />}
        <RepositoryList productSlug={slug} listStyle='compact' shadowOnContainer />
      </div>
      <div className='w-full lg:w-2/3 xl:w-3/4'>
        <div className='hidden lg:block'>
          <div className='px-4'>
            <Breadcrumb slugNameMapping={slugNameMapping} />
          </div>
        </div>
        <div className='w-full lg:w-2/3 xl:w-3/4'>
          <RepositoryForm productSlug={slug} />
        </div>
      </div>
    </div>
  )
}

const CreateRepository = () => {
  const router = useRouter()
  const { slug } = router.query

  return (
    <>
      <Header />
      <ClientOnly>
        <PageDefinition slug={slug} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateRepository
