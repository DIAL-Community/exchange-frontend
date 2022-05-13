import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import Head from 'next/head'
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

const CreateLink = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <div className='inline'>
      <a href={`/products/${product.slug}/repositories/create`} className='bg-dial-blue px-2 py-1 rounded text-white mr-5'>
        <img src='/icons/edit.svg' className='inline mr-2 pb-1' alt='Edit' height='12px' width='12px' />
        <span className='text-sm px-2'>{format('app.create-new')}</span>
      </a>
    </div>
  )
}

const ProductHeader = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <div className='border-t border-l border-r'>
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
  const [session] = useSession()
  const { data, loading, error } = useQuery(PRODUCT_QUERY, { variables: { slug: slug } })

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
    const map = {}
    if (data) {
      map[data.product.slug] = data.product.name
    }

    return map
  })()

  return (
    <div className='flex flex-wrap justify-between pb-8 max-w-catalog mx-auto'>
      <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
        <div className='block lg:hidden'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='w-full mb-2'>
          {
            session?.user && data?.product &&
            (
              session?.user.canEdit ||
              session?.user.own.products.filter(p => `${p}` === `${data.product.id}`).length > 0
            ) && <CreateLink product={data.product} />
          }
        </div>
        {data?.product && <ProductHeader product={data.product} />}
        <RepositoryList productSlug={slug} repositorySlug={repositorySlug} listStyle='compact' shadowOnContainer />
      </div>
      <div className='w-full lg:w-2/3 xl:w-3/4'>
        <RepositoryData repositorySlug={repositorySlug} autoLoadData />
      </div>
    </div>
  )
}

const ProductStep = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { query } = router
  const { slug, repositorySlug } = query

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ClientOnly>
        <PageDefinition slug={slug} repositorySlug={repositorySlug} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default ProductStep
