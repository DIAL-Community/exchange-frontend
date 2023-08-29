import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import ProductDetailHeader from './fragments/ProductDetailHeader'
import ProductDetailNav from './fragments/ProductDetailNav'
import ProductOwner from './fragments/ProductOwner'

const ProductDetailLeft = ({ scrollRef, product }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ProductDetailHeader product={product}/>
        <hr className='border-b border-dial-slate-200'/>
        <ProductOwner product={product}/>
        <hr className='border-b border-dial-slate-200'/>
        <ProductDetailNav product={product} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <Bookmark object={product} objectType={ObjectType.PRODUCT} />
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
        <Comment entityKey={'ui.product.label'} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default ProductDetailLeft
