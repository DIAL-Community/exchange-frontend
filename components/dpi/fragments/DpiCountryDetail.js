import DpiCountryProducts from './DpiCountryProducts'
import DpiCountryResources from './DpiCountryResources'

const DpiCountryDetail = ({ country }) => {
  return (
    <div className='flex flex-col gap-6'>
      <DpiCountryProducts country={country} />
      <DpiCountryResources country={country} />
    </div>
  )
}

export default DpiCountryDetail
