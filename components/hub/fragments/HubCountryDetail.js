import { HtmlViewer } from '../../shared/form/HtmlViewer'
import HubCountryProducts from './HubCountryProducts'
import HubCountryResources from './HubCountryResources'

const HubCountryDetail = ({ country }) => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='px-4 lg:px-8 xl:px-56'>
        <HtmlViewer initialContent={country?.description} />
      </div>
      <HubCountryProducts country={country} />
      <HubCountryResources country={country} />
    </div>
  )
}

export default HubCountryDetail
