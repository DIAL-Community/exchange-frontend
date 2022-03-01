import LeftDrawer from './LeftDrawer'
import MobileDrawer from './MobileDrawer'

const PageContent = ({ activeTab, filter, content, searchFilter, activeFilter, hint }) => {
  return (
    <div className='flex max-w-catalog mx-auto'>
      {
        // Left drawer with filters. Pages will pass filter object to the left drawer and render it.
        // This will be hidden on phone.
      }
      <LeftDrawer filter={filter} hint={hint} />
      <div className='md:pl-4 w-full h-full'>
        {
          // searchFilter: SearchFilter, search bar section. Pages will pass hint of the active nav.
          // activeFilter: Each component ActiveFilter (OrganizationActiveFilter, ProductActiveFilter, etc).
          // content: Main content of the page (OrganizationList, ProductList, etc).
        }
        {searchFilter}
        {activeFilter}
        <MobileDrawer filter={filter} hint={hint} activeTab={activeTab} />
        {content}
      </div>
    </div>
  )
}

export default PageContent
