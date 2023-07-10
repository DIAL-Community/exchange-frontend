import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import ProductDetailHeader from './fragments/ProductDetailHeader'
import ProductDetailNav from './fragments/ProductDetailNav'

const ProductDetailLeft = ({ scrollRef, product }) => {
  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-6 py-3'>
        <ProductDetailHeader product={product}/>
        <hr className='bg-slate-200'/>
        <ProductDetailNav product={product} scrollRef={scrollRef} />
        <hr className='bg-slate-200'/>
        <Bookmark object={product} objectType='PRODUCT' />
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default ProductDetailLeft
