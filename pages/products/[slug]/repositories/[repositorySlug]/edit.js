import Head from 'next/head'
import Link from 'next/link'
import { useIntl } from 'react-intl'

import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'

import { gql, useQuery } from '@apollo/client'

import apolloClient from '../../../../../lib/apolloClient'

import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import Breadcrumb from '../../../../../components/shared/breadcrumb'
import RepositoryList from '../../../../../components/products/repositories/RepositoryList'
import RepositoryForm from '../../../../../components/products/repositories/RepositoryForm'


const REPOSITORY_QUERY = gql`
  query ProductRepository($slug: String!) {
    productRepository(slug: $slug) {
      id
      name
      slug
      description
      absoluteUrl
      mainRepository

      languageData
      statisticalData

      product {
        id
        name
        slug
        imageFile
      }
    }
  }
`

const EditRepository = () => {
  const [session] = useSession()
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { slug, repositorySlug } = router.query
  const { data } = useQuery(REPOSITORY_QUERY, { variables: { slug: repositorySlug } })

  const slugNameMapping = (() => {
    const map = {}
    if (data) {
      map[data.productRepository.product.slug] = data.productRepository.product.name
      map[data.productRepository.slug] = data.productRepository.name
    }
    return map
  })()

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='flex flex-wrap justify-between pb-8 max-w-catalog mx-auto'>
        <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
          <div className='block lg:hidden'>
            <Breadcrumb slugNameMapping={slugNameMapping} />
          </div>
          {
            data && data.productRepository &&
              <>
                <div className='border'>
                  <Link href={`/products/${slug}`}>
                    <div className='cursor-pointer px-4 py-6 flex items-center'>
                      <img
                        className='w-8 h-full'
                        alt={format('image.alt.logoFor', { name: data.productRepository.product.name })}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + data.productRepository.product.imageFile}
                      />
                      <div className='text-xl text-product font-semibold px-4'>{data.productRepository.product.name}</div>
                    </div>
                  </Link>
                </div>
              </>
          }
          <RepositoryList productSlug={slug} repositorySlug={repositorySlug} listStyle='compact' shadowOnContainer/>
        </div>
        <div className='w-full lg:w-2/3 xl:w-3/4'>
          <RepositoryForm productRepository={data?.productRepository} productSlug={slug} />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default apolloClient()(EditRepository)
