import Bookmark from '../../shared/Bookmark'
import Comment from '../../shared/Comment'
import Share from '../../shared/Share'
import { ObjectType } from '../../../utils/constants'
import ProductOwner from '../../../product/fragments/ProductOwner'
import ProductDetailNav from './ProductDetailNav'
import ProductDetailHeader from './ProductDetailHeader'

const ProductDetailLeft = ({ scrollRef, product }) => {
  return (
    <div className='bg-white shadow-xl rounded-2xl'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ProductDetailHeader product={product}/>
        <hr className='border-s border-dial-slate-200'/>
        <ProductOwner product={product}/>
        <hr className='border-s border-dial-slate-200'/>
        <ProductDetailNav product={product} scrollRef={scrollRef} />
        <hr className='border-s border-dial-slate-200'/>
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={product} objectType={ObjectType.PRODUCT} />
          <hr className='border-s border-dial-slate-200'/>
          <Share />
          <hr className='border-s border-dial-slate-200'/>
          <Comment entityKey={'ui.product.label'} scrollRef={scrollRef} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetailLeft
