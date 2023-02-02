import { useQuery } from '@apollo/client'
import Link from 'next/link'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { CANDIDATE_PRODUCT_DETAIL_QUERY } from '../../../queries/candidate'
import { BREADCRUMB_SEPARATOR } from '../../shared/breadcrumb'
import EditButton from '../../shared/EditButton'
import { Error, Loading, Unauthorized } from '../../shared/FetchStatus'
import { HtmlViewer } from '../../shared/HtmlViewer'
import NotFound from '../../shared/NotFound'

const ProductDetail = ({ productSlug, locale }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user, isAdminUser, loadingUserSession } = useUser()

  const { loading, error, data } = useQuery(CANDIDATE_PRODUCT_DETAIL_QUERY, {
    variables: { slug: productSlug },
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (!data?.candidateProduct) {
    return <NotFound />
  }

  const generateEditLink = () => {
    if (!user) {
      return '/edit-not-available'
    }

    return `/candidate/products/${data?.candidateProduct?.slug}/edit`
  }

  const { candidateProduct: product } = data

  const generateBreadcrumb = (product) => (
    <div className='bg-white pb-3 lg:py-4 whitespace-nowrap text-ellipsis overflow-hidden'>
      <Link href='/'>
        <a className='inline text-dial-blue h5'>{format('app.home')}</a>
      </Link>
      <div className='inline h5'>
        {BREADCRUMB_SEPARATOR}
        <Link href='/candidate/products'>
          <a className='text-dial-blue'>
            {format('candidateProduct.label')}
          </a>
        </Link>
        {BREADCRUMB_SEPARATOR}
        {product.name}
      </div>
    </div>
  )

  return (
    loadingUserSession
      ? <Loading />
      : !isAdminUser
        ? <Unauthorized />
        : <>
          <div className='flex flex-col lg:flex-row pb-8'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <div className='block lg:hidden'>
                {generateBreadcrumb(product)}
              </div>
              <div className='pb-4'>
                {isAdminUser &&
                  <div className='flex flex-row gap-3'>
                    {
                      isAdminUser && product.rejected === null &&
                      <EditButton type='link' href={generateEditLink()} />
                    }
                  </div>
                }
              </div>
              <div className='bg-white border-2 border-dial-gray lg:mr-6 shadow-lg'>
                <div className='flex flex-col'>
                  <div className='flex p-2 border-b'>
                    {
                      product.rejected === true &&
                      <div className='ml-auto bg-red-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                        {format('candidate.rejected').toUpperCase()}
                      </div>
                    }
                    {
                      product.rejected === false &&
                      <div className='bg-emerald-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                        {format('candidate.approved').toUpperCase()}
                      </div>
                    }
                  </div>
                  <div className='font-semibold text-lg text-dial-gray-dark h-64 px-3 py-2'>
                    {product.name}
                  </div>
                  <div className='ml-auto text-sm italic text-dial-gray-dark px-3 py-2'>
                    {format('candidate.product.submittedBy')}: {product.submitterEmail}
                  </div>
                </div>
              </div>
            </div>
            <div className='px-4 w-full lg:w-2/3 xl:w-3/4 flex flex-col'>
              <div className='hidden lg:block'>
                {generateBreadcrumb(product)}
              </div>
              <div className='flex flex-col gap-3 mb-3'>
                <div className='card-title text-dial-gray-dark inline'>
                  {format('product.license')}
                </div>
                <div className='inline'>
                  {product.commercialProduct
                    ? format('product.license.commercial').toUpperCase()
                    : format('product.license.oss').toUpperCase()
                  }
                </div>
              </div>
              <div className='mt-8 card-title mb-3 text-dial-gray-dark'>
                {format('product.description')}
              </div>
              <HtmlViewer
                className='-mb-12'
                initialContent={product?.description}
                editorId='product-detail'
              />
            </div>
          </div>
        </>
  )
}

export default ProductDetail
