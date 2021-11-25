import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import withApollo from '../../../../lib/apolloClient'

import RepositoryList from '../../../../components/products/repositories/RepositoryList'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import { gql, useQuery } from '@apollo/client'
import Breadcrumb from '../../../../components/shared/breadcrumb'
import { useEffect } from 'react'

const PRODUCT_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      name
      slug
      imageFile
    }
  }
`

const ProductStep = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { pathname, asPath, query } = useRouter()
  
  const { slug, repositorySlug } = router.query
  const { data } = useQuery(PRODUCT_QUERY, { variables: { slug: slug } })

  const slugNameMapping = {}
  useEffect(() => {
    if (data) {
      slugNameMapping.timeStamp = Date.now()
      slugNameMapping[data.product.slug] = data.product.name
    }
  }, [data])

  useEffect(() => {
    if (query.locale) {
      router.replace({ pathname }, asPath, { locale: query.locale })
    }
  })

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
            data && data.product &&
              <div className='border'>
                <div className=' px-4 py-6 flex items-center'>
                  <img
                    className='w-8 h-full'
                    alt={format('image.alt.logoFor', { name: data.product.name })}
                    src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + data.product.imageFile}
                  />
                  <div className='text-xl text-product font-semibold px-4'>{data.product.name}</div>
                </div>
              </div>
          }
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
      <Footer />
    </>
  )
}

export default withApollo()(ProductStep)
