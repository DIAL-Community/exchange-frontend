import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import ReactHtmlParser from 'react-html-parser'
import { DiscourseCount } from '../shared/discourse'

const ProductDetailLeft = ({ product, discourseClick }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const [session] = useSession()

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    const { userEmail, userToken } = session.user
    return `
      ${process.env.NEXT_PUBLIC_RAILS_SERVER}/products/${product.slug}/edit?user_email=${userEmail}&user_token=${userToken}
    `
  }

  return (
    <>
      <div className='h-20'>
        <div className='w-full'>
          {
            session && (
              <div className='inline'>
                {
                  session.user.canEdit && (
                    <a href={generateEditLink()} className='bg-dial-blue px-2 py-1 rounded text-white mr-5'>
                      <img src='/icons/edit.svg' className='inline mr-2 pb-1' alt='Edit' height='12px' width='12px' />
                      <span className='text-sm px-2'>{format('app.edit')}</span>
                    </a>
                  )
                }
              </div>
            )
          }
          <button onClick={discourseClick}><DiscourseCount /></button>
        </div>
        <div className='h4 font-bold py-4'>{format('products.label')}</div>
      </div>
      <div className='bg-white border-t-2 border-l-2 border-r-2 border-dial-gray p-6 mr-6 shadow-lg'>
        <div id='header' className='mb-4'>
          <div className='h1 p-2 text-dial-purple'>
            {product.name}
          </div>
          <img alt={`${product.name} Logo`} className='p-2 m-auto' src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile} width='200px' height='200px' />
        </div>
        <div className='fr-view text-dial-gray-dark'>
          {product.productDescriptions[0] && ReactHtmlParser(product.productDescriptions[0].description)}
        </div>
      </div>
      {
        !product.owner &&
          <div className='bg-dial-gray-dark text-xs text-dial-gray-light p-6 mr-6 shadow-lg border-b-2 border-dial-gray'>
            {format('product.owner')}
            <a className='text-dial-yellow block mt-2' href='https://docs.osc.dial.community/projects/product-registry/en/latest/product_owner.html' target='_blank' rel='noreferrer'>
              {format('product.owner-link')}
            </a>
          </div>
      }
    </>
  )
}

export default ProductDetailLeft
