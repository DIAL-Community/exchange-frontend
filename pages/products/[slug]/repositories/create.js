import Head from 'next/head'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import apolloClient from '../../../../lib/apolloClient'
import { gql, useQuery } from '@apollo/client'

import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import RepositoryForm from '../../../../components/products/repositories/RepositoryForm'
import Breadcrumb from '../../../../components/shared/breadcrumb'
import RepositoryList from '../../../../components/products/repositories/RepositoryList'

const PRODUCT_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      name
      slug
      imageFile
    }
  }
`

const CreateRepository = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { slug } = router.query

  const { data } = useQuery(PRODUCT_QUERY, { variables: { slug: slug } })

  const slugNameMapping = (() => {
    const map = {}
    map[data?.product.slug] = data?.product.name
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
            data?.product &&
              <>
                <div className='border'>
                  <Link href={`/products/${slug}`}>
                    <div className='cursor-pointer px-4 py-6 flex items-center'>
                      <img
                        className='w-8 h-full'
                        alt={format('image.alt.logoFor', { name: data?.product.name })}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + data?.product.imageFile}
                      />
                      <div className='text-xl text-product font-semibold px-4'>{data?.product.name}</div>
                    </div>
                  </Link>
                </div>
              </>
          }
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
      <Footer />
    </>
  )
}

export default apolloClient()(CreateRepository)
