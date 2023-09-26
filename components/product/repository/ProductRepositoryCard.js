import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../../utils/constants'
import { isValidFn } from '../../utils/utilities'

const ProductRepositoryCard = ({ displayType, index, product, productRepository, dismissHandler }) => {
  const displayLargeCard = () =>
    <div className={`px-4 py-3 rounded-lg ${index % 2 === 0 && 'bg-dial-spearmint'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-2'>
        <div className='flex flex-col gap-y-2 max-w-3xl lg:w-10/12'>
          <div className='text-base font-semibold text-dial-meadow'>
            {productRepository.name}
          </div>
          <div className='text-sm'>
            {productRepository.absoluteUrl}
          </div>
        </div>
        <div className='text-sm italic lg:ml-auto mt-auto'>
          {productRepository.license}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/products/${product.slug}/repositories/${productRepository.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
      </Link>
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default ProductRepositoryCard
