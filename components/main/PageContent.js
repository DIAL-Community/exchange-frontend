import MobileFilter from './MobileFilter'

const PageContent = ({ activeTab, filter, content, searchFilter, activeFilter }) => {
  return (
    <>
      { filter && <MobileFilter activeTab={activeTab} filter={filter} /> }
      <div className='px-4 xl:px-16 py-4 xl:py-8 bg-dial-alice-blue'>
        <div className='flex flex-col xl:flex-row gap-3 xl:gap-x-24 xl:gap-y-8'>
          <div className={`${filter ? 'hidden xl:block w-full xl:w-3/12' : 'hidden'} row-span-2`}>
            { filter }
          </div>
          <div className={`${filter ? 'w-full xl:w-9/12' : 'w-full'} flex flex-col gap-3`}>
            {searchFilter}
            {activeFilter}
            {content}
          </div>
        </div>
      </div>
    </>
  )
}

export default PageContent
