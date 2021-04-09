import Link from 'next/link'
import ReactHtmlParser from 'react-html-parser'

const ProductCard = ({ product, listType }) => {
  return (
    <Link href={`/product/${product.slug}`}>
      {listType === 'list'
        ? (
          <div className='bg-white border-2 border-dial-gray p-2 m-2 shadow-lg flex justify-between items-center card-link'>
            <div className='inline-block w-1/3 text-lg font-bold truncate text-dial-gray-dark card-link-text'>
              {product.name}
            </div>
            <div className='inline-block w-1/3 right text-sm flex truncate justify-end'>
              {product.endorsers.map((endorser) => {
                return (<div key={endorser.slug} className='px-2 py-1 mx-1 rounded bg-dial-cyan text-white'>{endorser.slug.toUpperCase()}</div>)
              })}
            </div>
          </div>)
        : (
          <div className='bg-white border-2 border-dial-gray p-6 tracking-wide shadow-lg'>
            <div id='header' className='flex items-center mb-4'>
              <img alt='avatar' className='w-20 rounded-full border-2 border-gray-300' src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile} />
              <div id='header-text' className='leading-5 ml-6 sm'>
                <h4 id='name' className='text-xl font-semibold'>{product.name}</h4>
              </div>
            </div>
            <div id='quote' className='italic text-gray-600'>
              {product.productDescriptions[0] && ReactHtmlParser(product.productDescriptions[0].description)}
            </div>
          </div>
          )}
    </Link>
  )
}

export default ProductCard
