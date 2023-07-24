import { useRouter } from 'next/router'
import Bookmark from '../../shared/common/Bookmark'
import Comment from '../../shared/common/Comment'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import ProductFilter from './ProductFilter'

const ProductListLeft = () => {
  const { pathname } = useRouter()

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-6 py-3'>
        <ProductFilter />
        <hr className='bg-slate-200'/>
        <Bookmark object={pathname} objectType={ObjectType.URL}/>
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default ProductListLeft
