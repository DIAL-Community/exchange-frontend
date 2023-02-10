const PageContent = ({ filter, content, searchFilter, activeFilter }) => {
  return (
    <div className='px-4 xl:px-16 py-4 xl:py-8 bg-dial-alice-blue'>
      <div className='grid grid-cols-1 xl:grid-cols-7 gap-3 xl:gap-x-24 xl:gap-y-8'>
        <div className='xl:col-span-2 row-span-2'>
          {filter}
        </div>
        <div className='xl:col-span-5 my-auto'>
          {searchFilter}
        </div>
        <div className='xl:col-span-5 flex flex-col gap-3'>
          {activeFilter}
          {content}
        </div>
      </div>
    </div>
  )
}

export default PageContent
