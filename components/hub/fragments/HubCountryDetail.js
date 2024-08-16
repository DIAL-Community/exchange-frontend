import { HtmlViewer } from '../../shared/form/HtmlViewer'
import HubCountryPolicies from './HubCountryPolicies'
import HubCountryProducts from './HubCountryProducts'
import HubCountryResources from './HubCountryResources'
import HubCountryWebsites from './HubCountryWebsites'

const HubCountryDetail = ({ country }) => {
  return (
    <div className='flex flex-col'>
      <div className='policy-section'>
        <div className='px-4 lg:px-8 xl:px-56 text-dial-cotton flex flex-col'>
          <div className='text-xl font-medium py-6 text-dial-stratos'>
            Overview
          </div>
          { country?.description && <HtmlViewer initialContent={country?.description} />}
          { !country?.description && <div className='pb-6 text-dial-stratos'>No description available</div>}
        </div>
      </div>
      <HubCountryPolicies country={country} />
      <HubCountryWebsites country={country} />
      <HubCountryProducts country={country} />
      <HubCountryResources country={country} />
    </div>
  )
}

export default HubCountryDetail
