import CategoryIndicatorDetailHeader from './fragments/CategoryIndicatorDetailHeader'

const CategoryIndicatorEditLeft = ({ rubricCategory, categoryIndicator }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <CategoryIndicatorDetailHeader
          rubricCategory={rubricCategory}
          categoryIndicator={categoryIndicator}
        />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default CategoryIndicatorEditLeft
