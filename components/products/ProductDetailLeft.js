import { useIntl } from 'react-intl'
import ReactHtmlParser from 'react-html-parser'
import { DiscourseCount } from '../shared/discourse'

const ProductDetailLeft = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <div className='h-20'>
        <div className='w-full'>
          <button className='bg-dial-blue px-2 rounded text-white mr-5'>
            <img src='/icons/edit.svg' className='inline mr-2' alt='Edit' height='12px' width='12px' />
            {format('app.edit')}
          </button>
          <DiscourseCount />
        </div>
        <div className='h4 font-bold py-4'>{format('products.label')}</div>
      </div>
      <div className='bg-white border-t-2 border-l-2 border-r-2 border-dial-gray p-6 mr-6 shadow-lg'>
        <div id='header' className='mb-4'>
          <div className='h1 p-2'>
            {product.name}
          </div>
          <img alt={`${product.name} Logo`} className='p-2 m-auto' src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile} width='200px' height='200px' />
        </div>
        <div className='h4'>
          {product.productDescriptions[0] && ReactHtmlParser(product.productDescriptions[0].description)}
        </div>
      </div>
      { !product.owner &&
        <div className='bg-dial-gray-dark text-xs text-dial-gray-light p-6 mr-6 shadow-lg border-b-2 border-dial-gray'>
          {format('product.owner')}
          <a className='text-dial-yellow block mt-2' href='https://docs.osc.dial.community/projects/product-registry/en/latest/product_owner.html' target='_blank'>
            {format('product.owner-link')}
          </a>
        </div>
      }
    </>
  )
}

export default ProductDetailLeft
