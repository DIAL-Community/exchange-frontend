import DpiCountryTile from '../fragments/DpiCountryTile '
import DpiBreadcrumb from './DpiBreadcrumb'

const DpiCountries = () => {

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[70vh] py-8'>
      <div className='flex flex-col gap-6'>
        <DpiBreadcrumb />
        <DpiCountryTile />
      </div>
    </div>
  )
}

export default DpiCountries
