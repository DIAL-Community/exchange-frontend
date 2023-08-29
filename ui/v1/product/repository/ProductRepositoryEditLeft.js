import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import ProductDetailHeader from '../fragments/ProductDetailHeader'
import ProductRepositoryDetailNav from './fragments/ProductRepositoryDetailNav'

const ProductRepositoryEditLeft = ({ product, scrollRef }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ProductDetailHeader product={product}/>
        <hr className='border-b border-dial-slate-200'/>
        <ProductRepositoryDetailNav product={product} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <Bookmark object={product} objectType={ObjectType.PRODUCT}/>
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default ProductRepositoryEditLeft
