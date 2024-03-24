import DpiCountryProducts from './DpiCountryProducts'
import DpiCountryResources from './DpiCountryResources'

const DpiCountryDetail = ({ country }) => {
  return (
    <div className='flex flex-col gap-6'>
      <DpiCountryResources country={country} />
      <DpiCountryProducts country={country} />
    </div>
  )
}

export default DpiCountryDetail
