import ReactHtmlParser from 'react-html-parser'

const ProductCard = ({ product }) => (
  <div className='max-w-sm bg-white border-2 border-gray-300 p-6 rounded-md tracking-wide shadow-lg'>
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
)

export default ProductCard
