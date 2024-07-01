import HubCountryProducts from './HubCountryProducts'
import HubCountryResources from './HubCountryResources'

const HubCountryDetail = ({ country }) => {
  return (
    <div className='flex flex-col gap-6'>
      <HubCountryProducts country={country} />
      <HubCountryResources country={country} />
    </div>
  )
}

export default HubCountryDetail
