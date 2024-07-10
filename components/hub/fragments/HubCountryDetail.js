import { HtmlViewer } from '../../shared/form/HtmlViewer'
import HubCountryPolicies from './HubCountryPolicies'
import HubCountryProducts from './HubCountryProducts'
import HubCountryResources from './HubCountryResources'
import HubCountryWebsites from './HubCountryWebsites'

const HubCountryDetail = ({ country }) => {
  return (
    <div className='flex flex-col'>
      { country?.description &&
        <div className='px-4 lg:px-8 xl:px-56'>
          <HtmlViewer initialContent={country?.description} />
        </div>
      }
      <HubCountryPolicies country={country} />
      <HubCountryWebsites country={country} />
      <HubCountryProducts country={country} />
      <HubCountryResources country={country} />
    </div>
  )
}

export default HubCountryDetail
