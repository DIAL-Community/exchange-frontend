import Bookmark from '../../shared/common/Bookmark'
import Comment from '../../shared/common/Comment'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import ProductDetailHeader from '../fragments/ProductDetailHeader'
import ProductRepositoryDetailNav from './fragments/ProductRepositoryDetailNav'

const ProductRepositoryLeft = ({ product, scrollRef }) => {
  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ProductDetailHeader product={product} />
        <hr className='border-b border-dial-slate-200' />
        <ProductRepositoryDetailNav product={product} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200' />
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={product} objectType={ObjectType.PRODUCT} />
          <hr className='border-b border-dial-slate-200' />
          <Share />
          <hr className='border-b border-dial-slate-200' />
          <Comment entityKey={'ui.useCaseStep.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200' />
        </div>
      </div>
    </div>
  )
}

export default ProductRepositoryLeft
